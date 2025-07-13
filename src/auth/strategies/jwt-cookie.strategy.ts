import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt.payload";
import { jwtConstants } from "@/auth/constants/constant";

@Injectable()
export class JwtCookieStrategy  extends PassportStrategy(Strategy, 'jwt-cookie') {
  constructor() {
    super({
        jwtFromRequest: ExtractJwt.fromExtractors([
            (req: Request) => req.cookies?.token, // Extract JWT from cookies
            ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
            ExtractJwt.fromUrlQueryParameter('token'), // Extract JWT from URL query parameter
            ExtractJwt.fromHeader('authorization'), // Extract JWT from custom header
            ExtractJwt.fromBodyField('token') // Extract JWT from body field
        ]),
        ignoreExpiration: false,
        secretOrKey: jwtConstants.secret, // Use the secret defined in jwtConstants
    })
  }

  async validate(payload: JwtPayload): Promise<{id: string, username: string, email: string}> {
    return { id: payload.id, username: payload.username, email: payload.email };
  }
}