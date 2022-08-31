import { INestApplication, ValidationPipe } from '@nestjs/common';
import {Test} from '@nestjs/testing'
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';

describe('App e2e', ()=>{
  let app : INestApplication;
  let prisma: PrismaService;
  //start up logic
  beforeAll(async ()=> {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));
    await app.init(); 
    await app.listen(3333,'127.0.0.1');

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333')
  });

  //tear down logic
  afterAll(()=>{
    app.close();
  })

  describe('Auth', ()=>{
    const dto: AuthDto = {
      email: 'vlad@gmail.com',
      password: '123'
    };
    describe('Signup', ()=>{
      it('should throw if password empty',()=>{
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
             email: dto.email
          })
          .expectStatus(400);
      })
      it('should throw if email empty',()=>{
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
             password: dto.password
          })
          .expectStatus(400);
      })
      it('should throw if no body',()=>{
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400)
      })
      it('should signup', ()=>{
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .inspect()
      })
    });
    describe('Signin', ()=>{
      it('should throw if password empty',()=>{
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
             email: dto.email
          })
          .expectStatus(400);
      })
      it('should throw if email empty',()=>{
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
             password: dto.password
          })
          .expectStatus(400);
      })
      it('should throw if no body',()=>{
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400)
      })
      it('should signin', ()=>{
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .inspect()
      }) 
    });
    });

  describe('User',()=>{
    describe('Get me', ()=>{});
    describe('Edit user',()=>{});
  });

  describe('Bookmarks',()=>{
    describe('Create Bookmark', () => {});
    describe('Get Bookmark', () => {});
    describe('Get Bookmark by id', () => {});
    describe('Edit Bookmark', () => {});
    describe('Delete Bookmark', () => {});

  });
  
})