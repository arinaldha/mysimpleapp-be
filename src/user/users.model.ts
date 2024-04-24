import { Prisma } from '@prisma/client';

export class Users implements Prisma.usersCreateInput {
  id?: number;
  name: string;
  password: string;
  gender: string;
  phone: string;
  email: string;
  role_id: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
