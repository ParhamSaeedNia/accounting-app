import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Package extends Document {
  @ApiProperty()
  @Prop({ required: true })
  packageName: string;

  @ApiProperty()
  @Prop({ required: true })
  price: number;

  @ApiProperty({
    example: { infrastructure: 10, teacher: 50 },
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  @Prop({ type: Object, required: true })
  expenses: Record<string, number>;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
