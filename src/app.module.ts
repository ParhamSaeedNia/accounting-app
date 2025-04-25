import { Module } from '@nestjs/common';
import { PackagesModule } from './packages/packages.module';

@Module({
  imports: [PackagesModule],
})
export class AppModule {}
