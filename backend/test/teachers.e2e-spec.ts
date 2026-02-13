import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TeachersModule } from '../src/teachers/teachers.module';

describe('TeachersController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let createdTeacherId: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), TeachersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  describe('POST /teachers', () => {
    it('should create a new teacher', () => {
      return request(app.getHttpServer())
        .post('/teachers')
        .send({
          name: 'John Doe',
          email: 'john.doe@example.com',
          hourlyRate: 50,
          isActive: true,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.name).toBe('John Doe');
          expect(res.body.email).toBe('john.doe@example.com');
          expect(res.body.hourlyRate).toBe(50);
          expect(res.body.isActive).toBe(true);
          createdTeacherId = res.body._id;
        });
    });

    it('should create another teacher', () => {
      return request(app.getHttpServer())
        .post('/teachers')
        .send({
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          hourlyRate: 60,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe('Jane Smith');
          expect(res.body.isActive).toBe(true);
        });
    });
  });

  describe('GET /teachers', () => {
    it('should return all teachers', () => {
      return request(app.getHttpServer())
        .get('/teachers')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
        });
    });
  });

  describe('GET /teachers/active', () => {
    it('should return active teachers', () => {
      return request(app.getHttpServer())
        .get('/teachers/active')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
          res.body.forEach((teacher: any) => {
            expect(teacher.isActive).toBe(true);
          });
        });
    });
  });

  describe('GET /teachers/:id', () => {
    it('should return a specific teacher', () => {
      return request(app.getHttpServer())
        .get(`/teachers/${createdTeacherId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(createdTeacherId);
          expect(res.body.name).toBe('John Doe');
        });
    });
  });

  describe('PUT /teachers/:id', () => {
    it('should update a teacher', () => {
      return request(app.getHttpServer())
        .put(`/teachers/${createdTeacherId}`)
        .send({
          name: 'John Updated',
          email: 'john.updated@example.com',
          hourlyRate: 55,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('John Updated');
          expect(res.body.hourlyRate).toBe(55);
        });
    });
  });

  describe('PATCH /teachers/:id/deactivate', () => {
    it('should deactivate a teacher', () => {
      return request(app.getHttpServer())
        .patch(`/teachers/${createdTeacherId}/deactivate`)
        .expect(200)
        .expect((res) => {
          expect(res.body.isActive).toBe(false);
        });
    });
  });

  describe('PATCH /teachers/:id/activate', () => {
    it('should activate a teacher', () => {
      return request(app.getHttpServer())
        .patch(`/teachers/${createdTeacherId}/activate`)
        .expect(200)
        .expect((res) => {
          expect(res.body.isActive).toBe(true);
        });
    });
  });

  describe('DELETE /teachers/:id', () => {
    it('should delete a teacher', () => {
      return request(app.getHttpServer())
        .delete(`/teachers/${createdTeacherId}`)
        .expect(200);
    });

    it('should return 404 when deleting non-existent teacher', () => {
      return request(app.getHttpServer())
        .delete(`/teachers/${createdTeacherId}`)
        .expect(404);
    });
  });
});
