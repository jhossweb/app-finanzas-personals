import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "@/roles/enum/role.enum";

export class JwtCookieStrategy extends PassportStrategy(Strategy, 'jwt-cookie') {
  constructor(
  ) {
    super({
      jwtFromRequest: (req) => {
        const token = req.cookies['token'] || req.headers.authorization?.split(' ')[1];
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<{id: string, username: string, email: string, role: Role}> {
    return { id: payload.id, username: payload.username, email: payload.email, role: payload.role };
  }
}