import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({ example: 'Product 1', required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty()
  qty: number;

  @ApiProperty({ example: 1 })
  created_by: number;

  @ApiProperty({ example: 10.35, required: true })
  @IsNotEmpty()
  price: Prisma.Decimal;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  product_file: string;
}
