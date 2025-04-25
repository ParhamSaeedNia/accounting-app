import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePackageDto {
  @ApiProperty({
    example: 'Premium Package',
    description: 'The name of the package',
  })
  @IsNotEmpty()
  packageName: string;

  @ApiProperty({
    example: 1000,
    description: 'The price of the package',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: { infrastructure: 10, teacher: 50, marketing: 20 },
    description: 'Expenses as key-value pairs (percentage values)',
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  expenses: Record<string, number>;
}
