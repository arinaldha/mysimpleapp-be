import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/user/users.service';
import { LoginDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterUsersDto } from './dto/register-user.dto';
import { Users } from 'src/user/users.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const users = await this.prismaService.users.findUnique({
      where: { email, deleted_at: null },
    });

    if (!users) {
      throw new NotFoundException('user not found');
    }

    const validatePassword = await bcrypt.compare(password, users.password);

    if (!validatePassword) {
      throw new NotFoundException('invalid password');
    }

    return {
      token: this.jwtService.sign({
        email: email,
        name: users.name,
        user_id: users.id,
        role_id: users.role_id,
      }),
    };
  }

  async register(createDto: RegisterUsersDto): Promise<any> {
    const createUsers = new Users();
    createUsers.name = createDto.name;
    createUsers.email = createDto.email;
    createUsers.gender = createDto.gender;
    createUsers.phone = createDto.phone;
    createUsers.password = await bcrypt.hash(createDto.password, 10);
    createUsers.role_id = createDto.role_id;
    createUsers.created_at = new Date();

    const user = await this.usersService.createUser(createUsers);

    return {
      token: this.jwtService.sign({
        name: user.name,
        email: user.email,
        user_id: user.id,
        role_id: user.role_id,
      }),
    };
  }
}
