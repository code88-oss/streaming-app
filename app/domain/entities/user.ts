export interface User {
  username: string;
  email: string;
}

export class UserEntity {
  constructor(private user: User) {}

  getUsername(): string {
    return this.user.username;
  }

  getEmail(): string {
    return this.user.email;
  }
}
