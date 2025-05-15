import { Module } from '@nestjs/common';
import { PackagesModule } from './packages/packages.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/accounting',
    ),
    PackagesModule,
  ],
})
export class AppModule {}
