// =============================================================
// auth.service.test.js
//
// Unit tests for the auth service.
// We mock the repository and bcrypt so tests are:
//   - Fast (no DB)
//   - Isolated (test only service logic)
//   - Deterministic (no external state)
// =============================================================

const authService = require("../src/services/auth.service");
const userRepo = require("../src/repositories/user.repository");
const bcrypt = require("bcryptjs");
const { signToken } = require("../src/utils/jwt");

// Mock dependencies — we're testing service logic, not these modules
jest.mock("../src/repositories/user.repository");
jest.mock("bcryptjs");
jest.mock("../src/utils/jwt");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── register ───────────────────────────────────────────────

  describe("register()", () => {
    const dto = { name: "Alice", email: "alice@example.com", password: "Secret123" };
    const createdUser = { id: "uuid-1", name: "Alice", email: "alice@example.com" };

    it("creates a user and returns a token", async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed_password");
      userRepo.create.mockResolvedValue(createdUser);
      signToken.mockReturnValue("mock.jwt.token");

      const result = await authService.register(dto);

      expect(userRepo.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, expect.any(Number));
      expect(userRepo.create).toHaveBeenCalledWith({
        name: dto.name,
        email: dto.email,
        passwordHash: "hashed_password",
      });
      expect(result).toEqual({ user: createdUser, token: "mock.jwt.token" });
    });

    it("throws ConflictError when email is already registered", async () => {
      userRepo.findByEmail.mockResolvedValue({ id: "existing-id", email: dto.email });

      await expect(authService.register(dto)).rejects.toMatchObject({
        statusCode: 409,
        message: expect.stringContaining("already exists"),
      });

      expect(userRepo.create).not.toHaveBeenCalled();
    });
  });

  // ── login ──────────────────────────────────────────────────

  describe("login()", () => {
    const dto = { email: "alice@example.com", password: "Secret123" };
    const userRecord = {
      id: "uuid-1",
      name: "Alice",
      email: "alice@example.com",
      passwordHash: "hashed_password",
    };

    it("returns user and token on valid credentials", async () => {
      userRepo.findByEmail.mockResolvedValue(userRecord);
      bcrypt.compare.mockResolvedValue(true);
      signToken.mockReturnValue("mock.jwt.token");

      const result = await authService.login(dto);

      expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, userRecord.passwordHash);
      // Password hash must NOT be returned in the response
      expect(result.user).not.toHaveProperty("passwordHash");
      expect(result.token).toBe("mock.jwt.token");
    });

    it("throws UnauthorizedError when email not found", async () => {
      userRepo.findByEmail.mockResolvedValue(null);

      await expect(authService.login(dto)).rejects.toMatchObject({
        statusCode: 401,
        // Same message as wrong password — prevents email enumeration
        message: "Invalid email or password.",
      });
    });

    it("throws UnauthorizedError when password is wrong", async () => {
      userRepo.findByEmail.mockResolvedValue(userRecord);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login(dto)).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid email or password.",
      });
    });
  });
});
