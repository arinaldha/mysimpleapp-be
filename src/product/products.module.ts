import { Module, UnprocessableEntityException } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/product_file/',
        filename: (req, file, cb) => {
          const ext = file.originalname.split('.');
          return cb(null, `${Date.now()}_product_file.${ext[1]}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new UnprocessableEntityException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
