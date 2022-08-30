import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';

import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
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
      delete user.passHash;
      // return the saved user
      return user;
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
    const user = await this.prisma.user.findUnique({
        where: {
            email: dto.email,
        },
    });

    // if user does not exist throw exception
    if(!user) throw new ForbiddenException(
        'Incorrect Email'
    )

    // compare password
    // if password incorrect throe exception
    const pwMatches = await argon.verify(user.passHash, dto.password)
    if(!pwMatches){
        throw new ForbiddenException(
            'Incorrect Password'
        )
    }
    delete user.passHash
    return user;
  }
}
