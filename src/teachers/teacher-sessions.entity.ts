import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class TeacherSession extends Document {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the teacher who conducted the session',
  })
  @Prop({ required: true, type: Types.ObjectId, ref: 'Teacher' })
  teacherId: Types.ObjectId;

  @ApiProperty({
    example: 'Advanced React Course',
    description: 'Name or description of the session',
  })
  @Prop({ required: true })
  sessionName: string;

  @ApiProperty({
    example: 2,
    description: 'Duration of the session in hours',
  })
  @Prop({ required: true })
  duration: number;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date and time when the session was conducted',
  })
  @Prop({ required: true })
  sessionDate: Date;

  @ApiProperty({
    example: 100,
    description: 'Amount earned for this session (calculated automatically)',
  })
  @Prop()
  amountEarned: number;

  @ApiProperty({
    example: 'Monthly session for React course',
    description: 'Optional notes about the session',
  })
  @Prop()
  notes?: string;

  @ApiProperty({
    example: true,
    description: 'Whether this session is included in salary calculations',
  })
  @Prop({ default: true })
  isActive: boolean;

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

export const TeacherSessionSchema =
  SchemaFactory.createForClass(TeacherSession);
