import { Prisma } from '@prisma/client';

export class Products implements Prisma.productsCreateInput {
  name: string;
  qty: number;
  product_file: string;
  price: Prisma.Decimal;
  created_by: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
