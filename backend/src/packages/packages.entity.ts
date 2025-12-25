import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Package extends Document {
  @ApiProperty()
  @Prop({ required: true })
  packageName: string;

  @ApiProperty()
  @Prop({ required: true })
  price: number;

  @ApiProperty({
    example: { infrastructure: 100, teacher: 500 },
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  @Prop({ type: Object, required: true })
  expenses: Record<string, number>;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'The creation date of the package',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'The last update date of the package',
  })
  updatedAt: Date;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
