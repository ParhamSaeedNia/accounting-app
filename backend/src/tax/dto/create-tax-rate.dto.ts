import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class CreateTaxRateDto {
  @ApiProperty({
    example: 'Federal Income Tax',
    description: 'Name of the tax rate',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 15.5,
    description: 'Tax rate as a percentage (e.g., 15.5 for 15.5%)',
  })
  @IsNumber()
  rate: number;

  @ApiProperty({
    example: 'Federal',
    description: 'Category of the tax (Federal, State, Local, etc.)',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    example: true,
    description: 'Whether this tax rate is currently active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
