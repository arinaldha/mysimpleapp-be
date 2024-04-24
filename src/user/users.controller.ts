import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/authentication/auth.guard';
import { UpdateUsersDto } from './dto/update-user.dto';
import { RoleGuard } from 'src/authentication/role.guard';
import { CreateUsersDto } from './dto/create-user.dto';
import { ApiQuery } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
  })
  async getAllUsers(
    @Req() request: any,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const result = await this.userService.getAllUser(request);
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

  @Get('/get-roles')
  async getRoles(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const result = await this.userService.getRoles();
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

  @Get('/:id')
  async findUser(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const id = parseInt(request.params.id);
    try {
      const result = await this.userService.findOneUser(id);
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

  @Post()
  async createUser(
    @Req() request: Request,
    @Res() response: Response,
    @Body() creaeteUserDto: CreateUsersDto,
  ): Promise<any> {
    const id = parseInt(request.params.id);
    try {
      const result = await this.userService.createUser(creaeteUserDto);
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

  @Put('/:id')
  async updateUser(
    @Req() request: Request,
    @Res() response: Response,
    @Body() updateUserDto: UpdateUsersDto,
  ): Promise<any> {
    const id = parseInt(request.params.id);
    try {
      const result = await this.userService.updateUser(updateUserDto, id);
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
  async deleteUser(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const id = parseInt(request.params.id);
    try {
      const result = await this.userService.deleteUser(id);
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
