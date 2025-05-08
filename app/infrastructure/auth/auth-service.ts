export interface AuthService {
  authenticate(
    username: string,
    password: string
  ): Promise<{ username: string; email: string; token: string }>;
  register(
    username: string,
    email: string,
    password: string
  ): Promise<{ username: string; email: string; token: string }>;
  authenticateWithGoogle(
    googleToken: string
  ): Promise<{ username: string; email: string; token: string }>;
}

export class MockAuthService implements AuthService {
  async authenticate(
    username: string,
    password: string
  ): Promise<{ username: string; email: string; token: string }> {
    if (!username || !password) {
      throw new Error("Invalid credentials");
    }
    // Giả lập gửi password đến backend
    return {
      username,
      email: `${username}@example.com`,
      token: "mock-token",
    };
  }

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<{ username: string; email: string; token: string }> {
    if (!username || !email || !password) {
      throw new Error("Invalid registration data");
    }
    // Giả lập gửi password đến backend
    return {
      username,
      email,
      token: "mock-token",
    };
  }

  async authenticateWithGoogle(
    googleToken: string
  ): Promise<{ username: string; email: string; token: string }> {
    if (!googleToken) {
      throw new Error("Invalid Google token");
    }
    // Giả lập yêu cầu tài khoản đã đăng ký
    throw new Error("Account not found. Please sign up first.");
  }
}
