import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Tasks (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/tasks (POST) - Створення задачі (Успіх)', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Тестова задача через Jest',
        description: 'Перевірка e2e тесту',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.title).toEqual('Тестова задача через Jest');
        expect(res.body).toHaveProperty('id');
        expect(res.body.status).toEqual('todo');
      });
  });

  it('/tasks (POST) - Помилка валідації (короткий title)', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Ab',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body).toHaveProperty('error');
      });
  });

  it('/tasks (GET) - Отримання списку задач', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('items');
        expect(res.body).toHaveProperty('total');
        expect(Array.isArray(res.body.items)).toBe(true);
      });
  });

  it('/tasks/:id (GET) - Помилка 404 для неіснуючого ID', () => {
    return request(app.getHttpServer())
      .get('/tasks/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });
});