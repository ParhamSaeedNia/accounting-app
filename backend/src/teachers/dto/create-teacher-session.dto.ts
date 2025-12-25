import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateTeacherSessionDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the teacher who conducted the session',
  })
  @IsNotEmpty()
  teacherId: string;

  @ApiProperty({
    example: 'Advanced React Course',
    description: 'Name or description of the session',
  })
  @IsNotEmpty()
  @IsString()
  sessionName: string;

  @ApiProperty({
    example: 2,
    description: 'Duration of the session in hours',
  })
  @IsNumber()
  duration: number;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date and time when the session was conducted',
  })
  @IsDateString()
  sessionDate: string;

  @ApiProperty({
    example: 'Monthly session for React course',
    description: 'Optional notes about the session',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    example: true,
    description: 'Whether this session is included in salary calculations',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
