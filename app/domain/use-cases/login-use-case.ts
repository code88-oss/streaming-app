import { AuthService } from "@/app/infrastructure/auth/auth-service";
import { UserEntity } from "../entities/user";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: UserEntity;
  token: string;
}

export class LoginUseCase {
  constructor(private authService: AuthService) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const { username, password } = request;
    const userData = await this.authService.authenticate(username, password);
    const user = new UserEntity({
      username: userData.username,
      email: userData.email,
    });
    return { user, token: userData.token };
  }
}
