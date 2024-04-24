import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './jwt.service';
import { Request, Response, response } from 'express';
import { LoginDto } from './dto/login-user.dto';
import { RegisterUsersDto } from './dto/register-user.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Req() request: Request,
    @Res() response: Response,
    @Body() loginDto: LoginDto,
  ): Promise<any> {
    try {
      const result = await this.authService.login(loginDto);
      return response.status(200).json({
        message: 'Login successfully',
        response: result,
      });
    } catch (error) {
      return response.status(500).json({
        message: error,
      });
    }
  }

  @Post('/register')
  async register(
    @Req() request: Request,
    @Res() response: Response,
    @Body() registerDto: RegisterUsersDto,
  ): Promise<any> {
    try {
      const result = await this.authService.register(registerDto);
      return response.status(200).json({
        message: 'Register successfully',
        response: result,
      });
    } catch (error) {
      console.log('error when register user', error);

      return response.status(500).json({
        message: 'error when process data',
      });
    }
  }
}
