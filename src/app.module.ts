import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from './common/helper/env.helper';
import { PrismaModule } from './prisma/prisma.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`)
@Module({
  imports: [ConfigModule.forRoot({envFilePath, isGlobal:true}), AuthModule, UserModule, BookmarkModule, PrismaModule],
})
export class AppModule {}
