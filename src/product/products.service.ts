import { PrismaService } from 'src/prisma.service';
import { Products } from './products.model';
import * as fs from 'fs';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProduct(request: any): Promise<Products[]> {
    const user = request?.user;
    const search = request.query.search;

    let where = {};
    where['deleted_at'] = null;
    if (user?.role_id !== 1) {
      where['created_by'] = user.id;
    }

    if (search) {
      return this.prisma.products.findMany({
        where: {
          ...where,
          OR: [
            {
              name: {
                contains: search,
              },
            },
          ],
        },
      });
    }

    return this.prisma.products.findMany({
      where: where,
    });
  }

  async createProduct(data: Products): Promise<Products> {
    const existing = await this.prisma.products.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existing) {
      throw new ConflictException('product already exist');
    }

    data.created_at = new Date();

    return this.prisma.products.create({ data });
  }

  async findOneProduct(id: number): Promise<any> {
    const product = await this.prisma.products.findFirst({
      where: { id: id },
      select: {
        id: true,
        name: true,
        qty: true,
        price: true,
        product_file: true,
      },
    });

    if (!product) {
      throw new NotFoundException('product not found');
    }

    return product;
  }

  async updateProduct(data: Products, id: number): Promise<Products> {
    const product = await this.prisma.products.findFirst({
      where: { id: id },
    });

    if (!product) {
      throw new NotFoundException('product not found');
    }

    if (product.name !== data.name) {
      const existing = await this.prisma.products.findFirst({
        where: {
          name: data.name,
        },
      });

      if (existing) {
        throw new ConflictException('product already exist');
      }
    }

    if (!data.product_file) {
      data.product_file = product.product_file;
    }

    data.updated_at = new Date();

    await fs.unlink(`uploads/product_file/${product.product_file}`, (err) => {
      if (err) {
        console.error(err);
        return err;
      }
    });

    return this.prisma.products.update({
      where: { id: id },
      data: data,
    });
  }

  async deleteProduct(id: number): Promise<Products> {
    const product = await this.prisma.products.findFirst({
      where: { id: id },
    });

    if (!product) {
      throw new NotFoundException('product not found');
    }

    return this.prisma.products.update({
      where: { id: id },
      data: { deleted_at: new Date() },
    });
  }
}
