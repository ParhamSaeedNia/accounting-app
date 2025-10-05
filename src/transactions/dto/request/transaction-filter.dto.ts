import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsArray,
  IsString,
  IsDateString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { TransactionType, TransactionStatus } from '../../transactions.entity';

export enum SortField {
  DATE = 'transactionDate',
  AMOUNT = 'amount',
  NAME = 'name',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class TransactionFilterDto {
  @ApiProperty({
    example: 'income',
    enum: ['income', 'expense'],
    description: 'Filter by transaction type',
    required: false,
  })
  @IsOptional()
  @IsEnum(['income', 'expense'])
  type?: TransactionType;

  @ApiProperty({
    example: ['student-payment', 'teacher-salary'],
    description: 'Filter by tags (multiple tags can be selected)',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Start date for date range filter',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    example: '2024-01-31T23:59:59.999Z',
    description: 'End date for date range filter',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    example: '2024-01',
    description: 'Filter by specific month (YYYY-MM format)',
    required: false,
  })
  @IsOptional()
  @IsString()
  month?: string;

  @ApiProperty({
    example: '2024',
    description: 'Filter by specific year',
    required: false,
  })
  @IsOptional()
  @IsString()
  year?: string;

  @ApiProperty({
    example: 'active',
    enum: ['active', 'excluded'],
    description: 'Filter by transaction status',
    required: false,
  })
  @IsOptional()
  @IsEnum(['active', 'excluded'])
  status?: TransactionStatus;

  @ApiProperty({
    example: 'John',
    description: 'Search by name, notes, or description (partial matches)',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: 'amount',
    enum: SortField,
    description: 'Field to sort by',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortField)
  sortBy?: SortField;

  @ApiProperty({
    example: 'desc',
    enum: SortOrder,
    description: 'Sort order',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;

  @ApiProperty({
    example: 10,
    description: 'Number of results per page',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({
    example: 1,
    description: 'Page number (1-based)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;
}
