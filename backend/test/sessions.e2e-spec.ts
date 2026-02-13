import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { SessionsModule } from '../src/sessions/sessions.module';
import { TeachersModule } from '../src/teachers/teachers.module';
import { PackagesModule } from '../src/packages/packages.module';

describe('SessionsController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let teacherId: string;
  let packageId: string;
  let createdSessionId: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        SessionsModule,
        TeachersModule,
        PackagesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create prerequisite teacher and package
    const teacherRes = await request(app.getHttpServer())
      .post('/teachers')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        hourlyRate: 50,
      });
    teacherId = teacherRes.body._id;

    const packageRes = await request(app.getHttpServer())
      .post('/packages')
      .send({
        packageName: 'Premium Package',
        price: 1000,
        expenses: { infrastructure: 100 },
      });
    packageId = packageRes.body._id;
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  describe('POST /sessions', () => {
    it('should create a new session', () => {
      return request(app.getHttpServer())
        .post('/sessions')
        .send({
          teacherId,
          packageId,
          sessionDate: '2024-01-15T10:00:00Z',
          duration: 2,
          title: 'Math Session',
          notes: 'Covered algebra',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.duration).toBe(2);
          expect(res.body.title).toBe('Math Session');
          expect(res.body.teacher).toBeDefined();
          expect(res.body.teacher.name).toBe('John Doe');
          expect(res.body.package).toBeDefined();
          expect(res.body.package.packageName).toBe('Premium Package');
          createdSessionId = res.body._id;
        });
    });

    it('should create another session', () => {
      return request(app.getHttpServer())
        .post('/sessions')
        .send({
          teacherId,
          packageId,
          sessionDate: '2024-01-20T14:00:00Z',
          duration: 1.5,
          title: 'Science Session',
        })
        .expect(201);
    });
  });

  describe('GET /sessions', () => {
    it('should return all sessions with enriched data', () => {
      return request(app.getHttpServer())
        .get('/sessions')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
          expect(res.body[0]).toHaveProperty('teacher');
          expect(res.body[0]).toHaveProperty('package');
        });
    });
  });

  describe('GET /sessions/confirmed', () => {
    it('should return confirmed sessions', () => {
      return request(app.getHttpServer())
        .get('/sessions/confirmed')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('GET /sessions/by-teacher/:teacherId', () => {
    it('should return sessions for a specific teacher', () => {
      return request(app.getHttpServer())
        .get(`/sessions/by-teacher/${teacherId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
        });
    });
  });

  describe('GET /sessions/by-package/:packageId', () => {
    it('should return sessions for a specific package', () => {
      return request(app.getHttpServer())
        .get(`/sessions/by-package/${packageId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
        });
    });
  });

  describe('GET /sessions/by-date-range', () => {
    it('should return sessions within date range', () => {
      return request(app.getHttpServer())
        .get(
          '/sessions/by-date-range?startDate=2024-01-01T00:00:00Z&endDate=2024-01-31T23:59:59Z',
        )
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
        });
    });
  });

  describe('GET /sessions/:id', () => {
    it('should return a specific session', () => {
      return request(app.getHttpServer())
        .get(`/sessions/${createdSessionId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(createdSessionId);
          expect(res.body.title).toBe('Math Session');
        });
    });
  });

  describe('PUT /sessions/:id', () => {
    it('should update a session', () => {
      return request(app.getHttpServer())
        .put(`/sessions/${createdSessionId}`)
        .send({
          teacherId,
          packageId,
          sessionDate: '2024-01-15T10:00:00Z',
          duration: 3,
          title: 'Updated Math Session',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.duration).toBe(3);
          expect(res.body.title).toBe('Updated Math Session');
        });
    });
  });

  describe('PATCH /sessions/:id/confirm', () => {
    it('should confirm a session', () => {
      return request(app.getHttpServer())
        .patch(`/sessions/${createdSessionId}/confirm`)
        .expect(200)
        .expect((res) => {
          expect(res.body.isConfirmed).toBe(true);
        });
    });
  });

  describe('PATCH /sessions/:id/unconfirm', () => {
    it('should unconfirm a session', () => {
      return request(app.getHttpServer())
        .patch(`/sessions/${createdSessionId}/unconfirm`)
        .expect(200)
        .expect((res) => {
          expect(res.body.isConfirmed).toBe(false);
        });
    });
  });

  describe('DELETE /sessions/:id', () => {
    it('should delete a session', () => {
      return request(app.getHttpServer())
        .delete(`/sessions/${createdSessionId}`)
        .expect(200);
    });

    it('should return 404 when deleting non-existent session', () => {
      return request(app.getHttpServer())
        .delete(`/sessions/${createdSessionId}`)
        .expect(404);
    });
  });
});
