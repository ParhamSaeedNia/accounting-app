import { ApiProperty } from '@nestjs/swagger';

export class CalculateProfitResponseDto {
  @ApiProperty({
    example: 'Premium Package',
    description: 'The name of the package',
  })
  packageName: string;

  @ApiProperty({
    example: 1000,
    description: 'The original price of the package',
  })
  price: number;

  @ApiProperty({
    example: {
      infrastructure: 100,
      teacher: 500,
      marketing: 200,
    },
    description: 'Expense amounts by category (dollar amounts)',
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  expenses: Record<string, number>;

  @ApiProperty({
    example: 800,
    description: 'Total calculated expenses',
  })
  totalExpenses: number;

  @ApiProperty({
    example: 200,
    description: 'Calculated profit (price - totalExpenses)',
  })
  profit: number;
}
