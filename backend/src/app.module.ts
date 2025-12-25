import { Module } from '@nestjs/common';
import { PackagesModule } from './packages/packages.module';
import { TeachersModule } from './teachers/teachers.module';
import { SessionsModule } from './sessions/sessions.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/accounting',
    ),
    PackagesModule,
    TeachersModule,
    SessionsModule,
    TransactionsModule,
    DashboardModule,
  ],
})
export class AppModule {}
