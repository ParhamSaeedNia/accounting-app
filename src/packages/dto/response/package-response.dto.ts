import { ApiProperty } from '@nestjs/swagger';

export class PackageResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The unique identifier of the package',
  })
  _id: string;

  @ApiProperty({
    example: 'Premium Package',
    description: 'The name of the package',
  })
  packageName: string;

  @ApiProperty({
    example: 1000,
    description: 'The price of the package',
  })
  price: number;

  @ApiProperty({
    example: { infrastructure: 10, teacher: 50, marketing: 20 },
    description: 'Expense percentages by category',
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  expenses: Record<string, number>;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'The creation date of the package',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'The last update date of the package',
  })
  updatedAt: Date;
}
