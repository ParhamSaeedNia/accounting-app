import { ApiProperty } from '@nestjs/swagger';
import { TransactionType, TransactionStatus } from '../../transactions.entity';

export class TransactionResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The unique identifier of the transaction',
  })
  _id: string;

  @ApiProperty({
    example: 'Student Payment - John Smith',
    description: 'Name or title of the transaction',
  })
  name: string;

  @ApiProperty({
    example: 1000,
    description: 'Amount of the transaction in dollars',
  })
  amount: number;

  @ApiProperty({
    example: 'income',
    enum: ['income', 'expense'],
    description: 'Type of transaction: income or expense',
  })
  type: TransactionType;

  @ApiProperty({
    example: ['student-payment', 'premium-package'],
    description: 'Tags for categorizing the transaction',
  })
  tags: string[];

  @ApiProperty({
    example: 'Payment received for Premium Package subscription',
    description: 'Optional notes or description',
  })
  notes?: string;

  @ApiProperty({
    example: 'active',
    enum: ['active', 'excluded'],
    description: 'Status of the transaction: active or excluded',
  })
  status: TransactionStatus;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date when the transaction occurred',
  })
  transactionDate: Date;

  @ApiProperty({
    example: 0.1,
    description:
      'Tax rate applied to this transaction (as decimal, e.g., 0.1 for 10%)',
  })
  taxRate: number;

  @ApiProperty({
    example: 100,
    description: 'Calculated tax amount',
  })
  taxAmount: number;

  @ApiProperty({
    example: 900,
    description: 'Net amount after tax deduction',
  })
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
