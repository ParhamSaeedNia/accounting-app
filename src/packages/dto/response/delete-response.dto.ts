import { ApiProperty } from '@nestjs/swagger';

export class DeleteResponseDto {
  @ApiProperty({
    example: 'Package successfully deleted',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    example: 200,
    description: 'HTTP status code',
  })
  statusCode: number;
}
