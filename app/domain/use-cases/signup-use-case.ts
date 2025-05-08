import { AuthService } from "@/app/infrastructure/auth/auth-service";
import { UserEntity } from "@/app/domain/entities/user";

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  user: UserEntity;
  token: string;
}

export class SignUpUseCase {
  constructor(private authService: AuthService) {}

  async execute(request: SignUpRequest): Promise<SignUpResponse> {
    const { username, email, password } = request;
    const userData = await this.authService.register(username, email, password);
    const user = new UserEntity({
      username: userData.username,
      email: userData.email,
    });
    return { user, token: userData.token };
  }
}
