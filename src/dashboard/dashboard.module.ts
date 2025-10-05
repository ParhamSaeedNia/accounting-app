import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import {
  Transaction,
  TransactionSchema,
} from '../transactions/transactions.entity';
import { Session, SessionSchema } from '../sessions/sessions.entity';
import { Teacher, TeacherSchema } from '../teachers/teachers.entity';
import { Package, PackageSchema } from '../packages/packages.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Teacher.name, schema: TeacherSchema },
      { name: Package.name, schema: PackageSchema },
    ]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
  exports: [DashboardService],
})
export class DashboardModule {}
