import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TransactionsModule } from '../src/transactions/transactions.module';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let createdTransactionId: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), TransactionsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  describe('POST /transactions', () => {
    it('should create an income transaction with tax', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          name: 'Student Payment - John',
          amount: 1000,
          type: 'income',
          tags: ['student-payment', 'premium-package'],
          notes: 'Payment for premium package',
          transactionDate: '2024-01-15T10:00:00Z',
          taxRate: 0.1,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.name).toBe('Student Payment - John');
          expect(res.body.amount).toBe(1000);
          expect(res.body.taxAmount).toBe(100);
          expect(res.body.netAmount).toBe(900);
          expect(res.body.status).toBe('active');
          createdTransactionId = res.body._id;
        });
    });

    it('should create an expense transaction', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          name: 'Server Hosting',
          amount: 200,
          type: 'expense',
          tags: ['infrastructure'],
          transactionDate: '2024-01-20T10:00:00Z',
          taxRate: 0,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.type).toBe('expense');
          expect(res.body.taxAmount).toBe(0);
          expect(res.body.netAmount).toBe(200);
        });
    });

    it('should create another income transaction', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          name: 'Subscription - Jane',
          amount: 500,
          type: 'income',
          tags: ['subscription'],
          transactionDate: '2024-02-01T10:00:00Z',
          taxRate: 0.05,
        })
        .expect(201);
    });
  });

  describe('GET /transactions', () => {
    it('should return all transactions', () => {
      return request(app.getHttpServer())
        .get('/transactions')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(3);
        });
    });

    it('should filter transactions by type', () => {
      return request(app.getHttpServer())
        .get('/transactions?type=income')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
          res.body.forEach((t: any) => expect(t.type).toBe('income'));
        });
    });

    it('should filter transactions by search', () => {
      return request(app.getHttpServer())
        .get('/transactions?search=John')
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(1);
          expect(res.body[0].name).toContain('John');
        });
    });
  });

  describe('GET /transactions/summary', () => {
    it('should return transaction summary', () => {
      return request(app.getHttpServer())
        .get('/transactions/summary')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalIncome');
          expect(res.body).toHaveProperty('totalExpenses');
          expect(res.body).toHaveProperty('totalTax');
          expect(res.body).toHaveProperty('grossProfit');
          expect(res.body).toHaveProperty('expensesByCategory');
          expect(res.body).toHaveProperty('incomeByCategory');
        });
    });
  });

  describe('GET /transactions/:id', () => {
    it('should return a specific transaction', () => {
      return request(app.getHttpServer())
        .get(`/transactions/${createdTransactionId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(createdTransactionId);
          expect(res.body.name).toBe('Student Payment - John');
        });
    });
  });

  describe('PUT /transactions/:id', () => {
    it('should update a transaction and recalculate tax', () => {
      return request(app.getHttpServer())
        .put(`/transactions/${createdTransactionId}`)
        .send({
          name: 'Student Payment - John Updated',
          amount: 1200,
          type: 'income',
          transactionDate: '2024-01-15T10:00:00Z',
          taxRate: 0.15,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Student Payment - John Updated');
          expect(res.body.amount).toBe(1200);
          expect(res.body.taxAmount).toBe(180);
          expect(res.body.netAmount).toBe(1020);
        });
    });
  });

  describe('PATCH /transactions/:id/exclude', () => {
    it('should exclude a transaction', () => {
      return request(app.getHttpServer())
        .patch(`/transactions/${createdTransactionId}/exclude`)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('excluded');
        });
    });
  });

  describe('PATCH /transactions/:id/activate', () => {
    it('should activate a transaction', () => {
      return request(app.getHttpServer())
        .patch(`/transactions/${createdTransactionId}/activate`)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('active');
        });
    });
  });

  describe('DELETE /transactions/:id', () => {
    it('should delete a transaction', () => {
      return request(app.getHttpServer())
        .delete(`/transactions/${createdTransactionId}`)
        .expect(200);
    });

    it('should return 404 when deleting non-existent transaction', () => {
      return request(app.getHttpServer())
        .delete(`/transactions/${createdTransactionId}`)
        .expect(404);
    });
  });
});
