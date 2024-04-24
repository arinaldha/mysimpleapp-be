import { Module } from '@nestjs/common';
import { UsersModule } from './user/users.module';
import { AuthModule } from './authentication/auth.module';
import { ProductsModule } from './product/products.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
console.log('__dirname >>>', __dirname);

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProductsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../'),
      renderPath: '/uploads',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
