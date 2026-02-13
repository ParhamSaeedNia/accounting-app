import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PackagesModule } from '../src/packages/packages.module';

describe('PackagesController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let createdPackageId: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), PackagesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  describe('POST /packages', () => {
    it('should create a new package', () => {
      return request(app.getHttpServer())
        .post('/packages')
        .send({
          packageName: 'Premium Package',
          price: 1000,
          expenses: { infrastructure: 100, teacher: 500, marketing: 200 },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.packageName).toBe('Premium Package');
          expect(res.body.price).toBe(1000);
          expect(res.body.expenses).toEqual({
            infrastructure: 100,
            teacher: 500,
            marketing: 200,
          });
          createdPackageId = res.body._id;
        });
    });

    it('should create a second package', () => {
      return request(app.getHttpServer())
        .post('/packages')
        .send({
          packageName: 'Basic Package',
          price: 500,
          expenses: { infrastructure: 50 },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.packageName).toBe('Basic Package');
          expect(res.body.price).toBe(500);
        });
    });
  });

  describe('GET /packages', () => {
    it('should return all packages', () => {
      return request(app.getHttpServer())
        .get('/packages')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
        });
    });
  });

  describe('GET /packages/:id', () => {
    it('should return a specific package', () => {
      return request(app.getHttpServer())
        .get(`/packages/${createdPackageId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(createdPackageId);
          expect(res.body.packageName).toBe('Premium Package');
        });
    });
  });

  describe('PUT /packages/:id', () => {
    it('should update a package', () => {
      return request(app.getHttpServer())
        .put(`/packages/${createdPackageId}`)
        .send({
          packageName: 'Updated Premium Package',
          price: 1200,
          expenses: { infrastructure: 150, teacher: 600 },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.packageName).toBe('Updated Premium Package');
          expect(res.body.price).toBe(1200);
        });
    });
  });

  describe('GET /packages/:id/calculate', () => {
    it('should calculate profit for a package', () => {
      return request(app.getHttpServer())
        .get(`/packages/${createdPackageId}/calculate`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('packageName');
          expect(res.body).toHaveProperty('price', 1200);
          expect(res.body).toHaveProperty('totalExpenses', 750);
          expect(res.body).toHaveProperty('profit', 450);
        });
    });
  });

  describe('DELETE /packages/:id', () => {
    it('should delete a package', () => {
      return request(app.getHttpServer())
        .delete(`/packages/${createdPackageId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Package successfully deleted');
          expect(res.body).toHaveProperty('statusCode', 200);
        });
    });

    it('should return 404 when deleting non-existent package', () => {
      return request(app.getHttpServer())
        .delete(`/packages/${createdPackageId}`)
        .expect(404);
    });
  });
});
