import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionStatus {
  ACTIVE = 'active',
  EXCLUDED = 'excluded',
}

@Schema({ timestamps: true })
export class Transaction extends Document {
  @ApiProperty({
    example: 'Student Payment - John Smith',
    description: 'Name or title of the transaction',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    example: 1000,
    description: 'Amount of the transaction in dollars',
  })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({
    example: 'income',
    enum: TransactionType,
    description: 'Type of transaction: income or expense',
  })
  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @ApiProperty({
    example: ['student-payment', 'premium-package'],
    description: 'Tags for categorizing the transaction',
  })
  @Prop({ type: [String], default: [] })
  tags: string[];

  @ApiProperty({
    example: 'Payment received for Premium Package subscription',
    description: 'Optional notes or description',
  })
  @Prop()
  notes?: string;

  @ApiProperty({
    example: 'active',
    enum: TransactionStatus,
    description: 'Status of the transaction: active or excluded',
  })
  @Prop({ default: TransactionStatus.ACTIVE, enum: TransactionStatus })
  status: TransactionStatus;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date when the transaction occurred',
  })
  @Prop({ required: true })
  transactionDate: Date;

  @ApiProperty({
    example: 0.1,
    description:
      'Tax rate applied to this transaction (as decimal, e.g., 0.1 for 10%)',
  })
  @Prop({ default: 0 })
  taxRate: number;

  @ApiProperty({
    example: 100,
    description: 'Calculated tax amount',
  })
  @Prop({ default: 0 })
  taxAmount: number;

  @ApiProperty({
    example: 900,
    description: 'Net amount after tax deduction',
  })
  @Prop({ default: 0 })
  netAmount: number;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'The creation date of the transaction record',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'The last update date of the transaction record',
  })
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
