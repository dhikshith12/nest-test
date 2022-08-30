import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt'
    ) {
    constructor(config: ConfigService,private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        });
    }

    async validate(paylod: {sub : number, email: string}){
        const user = await this.prisma.user.findUnique({
            where:{
                id: paylod.sub,
            },
        });
        delete user.passHash;
        return user;
    }
}