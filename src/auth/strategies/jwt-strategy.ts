import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt.payload";
import { jwtConstants } from "../constants/constant";

export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req.cookies?.token,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                ExtractJwt.fromUrlQueryParameter('token'),
                ExtractJwt.fromHeader('authorization'),
                ExtractJwt.fromBodyField('token')
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        })
    }

    async validate(payload: JwtPayload): Promise<{ id: string; username: string; email: string }> {
        return { id: payload.id, username: payload.username, email: payload.email };
    }

}