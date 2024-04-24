import { PrismaService } from 'src/prisma.service';
import { Users } from './users.model';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUser(request: any): Promise<any> {
    const search = request.query.search;
    const where = {
      deleted_at: null,
    };
    const select = {
      id: true,
      name: true,
      email: true,
      phone: true,
      gender: true,
      role_id: true,
      role: true,
    };

    if (search) {
      return this.prisma.users.findMany({
        where: {
          OR: [
            {
              name: {
                contains: search,
              },
            },
          ],
        },
        select: select,
      });
    }

    return this.prisma.users.findMany({
      where: where,
      select: select,
    });
  }

  async findOneUser(id: number): Promise<any> {
    const user = await this.prisma.users.findFirst({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        role_id: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async createUser(data: Users): Promise<Users> {
    const existing = await this.prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existing) {
      throw new ConflictException('email already exist');
    }

    data.password = await bcrypt.hash(data.password, 10);
    data.created_at = new Date();

    return this.prisma.users.create({ data });
  }

  async updateUser(data: Users, id: number): Promise<Users> {
    const user = await this.prisma.users.findFirst({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const existing = await this.prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (data.email !== user.email && existing) {
      throw new ConflictException('email already exist');
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      data.password = user.password;
    }

    data.updated_at = new Date();

    return this.prisma.users.update({
      where: { id: id },
      data: data,
    });
  }

  async deleteUser(id: number): Promise<Users> {
    const user = await this.prisma.users.findFirst({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.prisma.users.update({
      where: { id: id },
      data: { deleted_at: new Date() },
    });
  }

  async getRoles(): Promise<any> {
    return this.prisma.roles.findMany();
  }
}
