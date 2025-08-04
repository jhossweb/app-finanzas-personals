import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { AuthService } from "../services/auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginAuthDto } from "../dto/create-auth.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: (req) => req.body.token || req.headers.authorization?.split(' ')[1],
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Use the secret defined in environment variables
    });
  }

  async validate(dataLogin: LoginAuthDto): Promise<any> {
    
    const user = await this.authService.login(dataLogin);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}