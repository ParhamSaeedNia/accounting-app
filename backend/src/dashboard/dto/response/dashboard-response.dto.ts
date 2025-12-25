import { ApiProperty } from '@nestjs/swagger';

export class DashboardResponseDto {
  @ApiProperty({
    example: 25,
    description: 'Number of users with active session packages',
  })
  activeSessionPackages: number;

  @ApiProperty({
    example: 15,
    description: 'Number of users with active subscription packages',
  })
  activeSubscriptionPackages: number;

  @ApiProperty({
    example: 50000,
    description: 'Total income (net amount after taxes)',
  })
  totalIncome: number;

  @ApiProperty({
    example: 30000,
    description: 'Total expenses',
  })
  totalExpenses: number;

  @ApiProperty({
    example: 20000,
    description: 'Gross profit (total income - total expenses)',
  })
  grossProfit: number;

  @ApiProperty({
    example: 15000,
    description: 'Total teacher salaries (calculated automatically)',
  })
  totalTeacherSalaries: number;

  @ApiProperty({
    example: 5000,
    description:
      'Net profit after teacher salaries (gross profit - teacher salaries)',
  })
  netProfit: number;

  @ApiProperty({
    example: 5000,
    description: 'Total tax amount collected',
  })
  totalTax: number;

  @ApiProperty({
    example: {
      'teacher-salary': 15000,
      infrastructure: 5000,
      marketing: 3000,
      tools: 2000,
    },
    description: 'Expenses breakdown by category',
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  expensesByCategory: Record<string, number>;

  @ApiProperty({
    example: {
      'student-payment': 45000,
      subscription: 5000,
    },
    description: 'Income breakdown by category',
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  incomeByCategory: Record<string, number>;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Start date of the period being analyzed',
  })
  periodStart: Date;

  @ApiProperty({
    example: '2024-01-31T23:59:59.999Z',
    description: 'End date of the period being analyzed',
  })
  periodEnd: Date;
}
