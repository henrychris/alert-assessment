export class JwtPayload {
  constructor(userId: number, roles: string[]) {
    this.sub = userId;
    this.roles = roles;
  }

  sub: number;
  roles: string[];
}
