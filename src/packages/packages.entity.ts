import { ApiProperty } from '@nestjs/swagger';

export class Package {
  @ApiProperty()
  _id?: string;

  @ApiProperty()
  packageName: string;

  @ApiProperty()
  price: number;

  @ApiProperty({
    example: { infrastructure: 10, teacher: 50 },
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  expenses: Record<string, number>;
}
