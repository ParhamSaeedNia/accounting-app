import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the teacher who conducted the session',
  })
  @IsNotEmpty()
  teacherId: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the package this session belongs to',
  })
  @IsNotEmpty()
  packageId: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date and time when the session was conducted',
  })
  @IsDateString()
  sessionDate: string;

  @ApiProperty({
    example: 2,
    description: 'Duration of the session in hours',
  })
  @IsNumber()
  duration: number;

  @ApiProperty({
    example: 'Advanced React Concepts',
    description: 'Title or description of the session',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Session went well, covered hooks and state management',
    description: 'Optional notes about the session',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    example: true,
    description:
      'Whether the session is confirmed and should be included in calculations',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isConfirmed?: boolean;
}
