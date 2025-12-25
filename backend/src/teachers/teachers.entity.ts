import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Teacher extends Document {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the teacher',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the teacher',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    example: 50,
    description: 'Hourly rate in dollars',
  })
  @Prop({ required: true })
  hourlyRate: number;

  @ApiProperty({
    example: true,
    description: 'Whether the teacher is currently active',
  })
  @Prop({ default: true })
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

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
