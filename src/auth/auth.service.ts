import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
        private prisma: PrismaService, 
        private jwt: JwtService,
        private config: ConfigService
    ) {}

  async signup(dto: AuthDto) {
    try {
      // generate the password hash
      const hash = await argon.hash(dto.password);
      // save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          passHash: hash,
        },
      });
      // return the saved user
      return this.signToken(user.id,user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('credentials taken');
        }
      }
      throw error;
    }
  }
  async signin(dto: AuthDto) {
    // find the user by email
    let user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Account does not exist');

    // see if the user is already logged in
    if (user.loggedIn) {
      throw new ForbiddenException('Active session running...');
    }
    // compare password
    // if password incorrect throe exception
    const pwMatches = await argon.verify(user.passHash, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Incorrect Password');
    }
    user = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        loggedIn: true,
      },
    });
    return this.signToken(user.id,user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{access_token: string}> {
    const data = {
        sub: userId,
        email
    }

    const token = await this.jwt.signAsync(data,{
        expiresIn: '10d',
        secret: this.config.get('JWT_SECRET'),
    })
    return {
        access_token: token,
    }
  }
}
