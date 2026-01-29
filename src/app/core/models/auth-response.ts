export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public role: string
  ) {}
}

export class AuthResponse {
  constructor(
    public user: User,
    public token: string
  ) {}
}

