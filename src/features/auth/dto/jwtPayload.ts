export class JwtPayload {
  constructor(userId: number) {
    this.sub = userId;
  }
  sub: number;
}
