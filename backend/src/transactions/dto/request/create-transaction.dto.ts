import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { TransactionType, TransactionStatus } from '../../transactions.entity';

export class CreateTransactionDto {
  @ApiProperty({
    example: 'Student Payment - John Smith',
    description: 'Name or title of the transaction',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1000,
    description: 'Amount of the transaction in dollars',
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    example: 'income',
    enum: ['income', 'expense'],
    description: 'Type of transaction: income or expense',
  })
  @IsEnum(['income', 'expense'])
  type: TransactionType;

  @ApiProperty({
    example: ['student-payment', 'premium-package'],
    description: 'Tags for categorizing the transaction',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    example: 'Payment received for Premium Package subscription',
    description: 'Optional notes or description',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    example: 'active',
    enum: ['active', 'excluded'],
    description: 'Status of the transaction: active or excluded',
    required: false,
  })
  @IsOptional()
  @IsEnum(['active', 'excluded'])
  status?: TransactionStatus;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date when the transaction occurred',
  })
  @IsDateString()
  transactionDate: string;

  @ApiProperty({
    example: 0.1,
    description:
      'Tax rate applied to this transaction (as decimal, e.g., 0.1 for 10%)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  taxRate?: number;
}
