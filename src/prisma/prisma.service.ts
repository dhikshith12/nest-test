import { Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(){
        super({
            datasources: {
                db: {
                    url: 'postgresql://postgres:dhiks@123@localhost:5434/nest?schema=public'
                }
            }
        })
    }
}
