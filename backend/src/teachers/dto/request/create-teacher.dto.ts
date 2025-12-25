import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the teacher',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the teacher',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 50,
    description: 'Hourly rate in dollars',
  })
  @IsNumber()
  hourlyRate: number;

  @ApiProperty({
    example: true,
    description: 'Whether the teacher is currently active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
