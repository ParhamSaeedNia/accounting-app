import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class TaxRate extends Document {
  @ApiProperty({
    example: 'Federal Income Tax',
    description: 'Name of the tax rate',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    example: 15.5,
    description: 'Tax rate as a percentage (e.g., 15.5 for 15.5%)',
  })
  @Prop({ required: true })
  rate: number;

  @ApiProperty({
    example: 'Federal',
    description: 'Category of the tax (Federal, State, Local, etc.)',
  })
  @Prop({ required: true })
  category: string;

  @ApiProperty({
    example: true,
    description: 'Whether this tax rate is currently active',
  })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'The creation date of the tax rate',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'The last update date of the tax rate',
  })
  updatedAt: Date;
}

export const TaxRateSchema = SchemaFactory.createForClass(TaxRate);
