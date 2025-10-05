import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Session extends Document {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the teacher who conducted the session',
  })
  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  teacherId: Types.ObjectId;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the package this session belongs to',
  })
  @Prop({ type: Types.ObjectId, ref: 'Package', required: true })
  packageId: Types.ObjectId;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date and time when the session was conducted',
  })
  @Prop({ required: true })
  sessionDate: Date;

  @ApiProperty({
    example: 2,
    description: 'Duration of the session in hours',
  })
  @Prop({ required: true })
  duration: number;

  @ApiProperty({
    example: 'Advanced React Concepts',
    description: 'Title or description of the session',
  })
  @Prop()
  title?: string;

  @ApiProperty({
    example: 'Session went well, covered hooks and state management',
    description: 'Optional notes about the session',
  })
  @Prop()
  notes?: string;

  @ApiProperty({
    example: true,
    description:
      'Whether the session is confirmed and should be included in calculations',
  })
  @Prop({ default: true })
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

export const SessionSchema = SchemaFactory.createForClass(Session);
