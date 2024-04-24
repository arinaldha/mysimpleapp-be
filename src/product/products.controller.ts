import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpStatus,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/authentication/auth.guard';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
  })
  async getAllProducts(
    @Req() request: any,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const result = await this.productService.getAllProduct(request);
      return response.status(200).json({
        message: 'Data fetched successfully',
        response: result,
      });
    } catch (error) {
      console.log('error get product', error);

      return response.status(500).json({
        message: error,
      });
    }
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateProductDto,
  })
  @UseInterceptors(FileInterceptor('product_file'))
  async createProduct(
    @Req() request: any,
    @Res() response: Response,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg|jpg|png',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      createProductDto.created_by = request?.user?.id;
      createProductDto.qty = parseInt(createProductDto.qty.toString());
      createProductDto.product_file = file.filename;
      const result = await this.productService.createProduct(createProductDto);
      return response.status(200).json({
        message: 'Data created successfully',
        response: result,
      });
    } catch (error) {
      return response.status(500).json({
        message: error,
      });
    }
  }

  @Get('/:id')
  async findProduct(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const id = parseInt(request.params.id);
    try {
      const result = await this.productService.findOneProduct(id);
      return response.status(200).json({
        message: 'Data fetched successfully',
        response: result,
      });
    } catch (error) {
      return response.status(500).json({
        message: error,
      });
    }
  }

  @Put('/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateProductDto,
  })
  @UseInterceptors(FileInterceptor('product_file'))
  async updateProduct(
    @Req() request: Request,
    @Res() response: Response,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'jpeg|jpg|png' })],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ): Promise<any> {
    const id = parseInt(request.params.id);
    updateProductDto.qty = parseInt(updateProductDto.qty.toString());
    if (file) {
      updateProductDto.product_file = file.filename;
    }
    try {
      const result = await this.productService.updateProduct(
        updateProductDto,
        id,
      );
      return response.status(200).json({
        message: 'Data updated successfully',
        response: result,
      });
    } catch (error) {
      return response.status(500).json({
        message: error,
      });
    }
  }

  @Delete('/:id')
  async deleteProduct(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const id = parseInt(request.params.id);
    try {
      const result = await this.productService.deleteProduct(id);
      return response.status(200).json({
        message: 'Data deleted successfully',
        response: result,
      });
    } catch (error) {
      return response.status(500).json({
        message: error,
      });
    }
  }
}
