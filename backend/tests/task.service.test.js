// =============================================================
// task.service.test.js
//
// Unit tests for task service.
// Focused on ownership enforcement and business rules.
// =============================================================

const taskService = require("../src/services/task.service");
const taskRepo = require("../src/repositories/task.repository");
const projectRepo = require("../src/repositories/project.repository");

jest.mock("../src/repositories/task.repository");
jest.mock("../src/repositories/project.repository");

const USER_ID = "user-123";
const OTHER_USER_ID = "user-999";
const PROJECT_ID = "project-abc";
const TASK_ID = "task-xyz";

const mockProject = { id: PROJECT_ID, userId: USER_ID, name: "Test Project", deletedAt: null };
const mockTask = { id: TASK_ID, projectId: PROJECT_ID, title: "Do something", deletedAt: null };

describe("TaskService", () => {
  beforeEach(() => jest.clearAllMocks());

  // ── getAll ─────────────────────────────────────────────────

  describe("getAll()", () => {
    it("returns tasks when user owns the project", async () => {
      projectRepo.findById.mockResolvedValue(mockProject);
      taskRepo.findAllByProject.mockResolvedValue([mockTask]);

      const tasks = await taskService.getAll(PROJECT_ID, USER_ID, {});

      expect(taskRepo.findAllByProject).toHaveBeenCalledWith(PROJECT_ID, {});
      expect(tasks).toEqual([mockTask]);
    });

    it("throws 403 when user does not own the project", async () => {
      projectRepo.findById.mockResolvedValue(mockProject);

      await expect(
        taskService.getAll(PROJECT_ID, OTHER_USER_ID, {})
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it("throws 404 when project does not exist", async () => {
      projectRepo.findById.mockResolvedValue(null);

      await expect(
        taskService.getAll(PROJECT_ID, USER_ID, {})
      ).rejects.toMatchObject({ statusCode: 404, message: "Project not found" });
    });
  });

  // ── create ─────────────────────────────────────────────────

  describe("create()", () => {
    it("creates a task in an owned project", async () => {
      projectRepo.findById.mockResolvedValue(mockProject);
      taskRepo.create.mockResolvedValue(mockTask);

      const dto = { title: "New task", priority: "high" };
      const result = await taskService.create(PROJECT_ID, USER_ID, dto);

      expect(taskRepo.create).toHaveBeenCalledWith({ projectId: PROJECT_ID, ...dto });
      expect(result).toEqual(mockTask);
    });

    it("throws 403 when attempting to create in another user's project", async () => {
      projectRepo.findById.mockResolvedValue(mockProject);

      await expect(
        taskService.create(PROJECT_ID, OTHER_USER_ID, { title: "Hack" })
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });

  // ── update ─────────────────────────────────────────────────

  describe("update()", () => {
    it("updates a task that belongs to the owned project", async () => {
      projectRepo.findById.mockResolvedValue(mockProject);
      taskRepo.findById.mockResolvedValue(mockTask);
      taskRepo.update.mockResolvedValue({ ...mockTask, title: "Updated" });

      const result = await taskService.update(TASK_ID, PROJECT_ID, USER_ID, { title: "Updated" });

      expect(taskRepo.update).toHaveBeenCalledWith(TASK_ID, { title: "Updated" });
      expect(result.title).toBe("Updated");
    });

    it("throws 404 when task does not exist", async () => {
      projectRepo.findById.mockResolvedValue(mockProject);
      taskRepo.findById.mockResolvedValue(null);

      await expect(
        taskService.update(TASK_ID, PROJECT_ID, USER_ID, { title: "X" })
      ).rejects.toMatchObject({ statusCode: 404, message: "Task not found" });
    });

    it("throws 403 when task belongs to a different project", async () => {
      projectRepo.findById.mockResolvedValue(mockProject);
      taskRepo.findById.mockResolvedValue({ ...mockTask, projectId: "other-project" });

      await expect(
        taskService.update(TASK_ID, PROJECT_ID, USER_ID, { title: "X" })
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });

  // ── remove ─────────────────────────────────────────────────

  describe("remove()", () => {
    it("soft-deletes a task", async () => {
      projectRepo.findById.mockResolvedValue(mockProject);
      taskRepo.findById.mockResolvedValue(mockTask);
      taskRepo.softDelete.mockResolvedValue({});

      await taskService.remove(TASK_ID, PROJECT_ID, USER_ID);

      expect(taskRepo.softDelete).toHaveBeenCalledWith(TASK_ID);
    });
  });
});
