import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  IsDateString,
} from 'class-validator';
import { TransactionType, TransactionStatus } from '../transactions.entity';

export class CreateTransactionDto {
  @ApiProperty({
    example: 'Student Payment - John Smith',
    description: 'Name or description of the transaction',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 1000,
    description: 'Amount of the transaction in dollars',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: TransactionType.INCOME,
    enum: TransactionType,
    description: 'Type of transaction (income or expense)',
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    example: ['student-payment', 'premium-package'],
    description: 'Tags associated with this transaction',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    example: 'Payment for premium package subscription',
    description: 'Optional notes about the transaction',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    example: TransactionStatus.ACTIVE,
    enum: TransactionStatus,
    description: 'Status of the transaction (active or excluded)',
    required: false,
  })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date when the transaction occurred',
  })
  @IsDateString()
  transactionDate: string;
}
