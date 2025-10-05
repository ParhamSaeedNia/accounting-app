import { ApiProperty } from '@nestjs/swagger';

export class SessionResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The unique identifier of the session',
  })
  _id: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the teacher who conducted the session',
  })
  teacherId: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the package this session belongs to',
  })
  packageId: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date and time when the session was conducted',
  })
  sessionDate: Date;

  @ApiProperty({
    example: 2,
    description: 'Duration of the session in hours',
  })
  duration: number;

  @ApiProperty({
    example: 'Advanced React Concepts',
    description: 'Title or description of the session',
  })
  title?: string;

  @ApiProperty({
    example: 'Session went well, covered hooks and state management',
    description: 'Optional notes about the session',
  })
  notes?: string;

  @ApiProperty({
    example: true,
    description:
      'Whether the session is confirmed and should be included in calculations',
  })
  isConfirmed: boolean;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'The creation date of the session record',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'The last update date of the session record',
  })
  updatedAt: Date;
}
