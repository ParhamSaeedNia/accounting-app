import { ApiProperty } from '@nestjs/swagger';

export class TeacherResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The unique identifier of the teacher',
  })
  _id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the teacher',
  })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the teacher',
  })
  email: string;

  @ApiProperty({
    example: 50,
    description: 'Hourly rate in dollars',
  })
  hourlyRate: number;

  @ApiProperty({
    example: true,
    description: 'Whether the teacher is currently active',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'The creation date of the teacher record',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'The last update date of the teacher record',
  })
  updatedAt: Date;
}
