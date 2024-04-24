import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export class CreateUsersDto {
  @ApiProperty({ example: 'Male', required: true })
  @IsNotEmpty()
  @IsString()
  @IsEnum(Gender)
  @Length(1, 10)
  gender: string;

  @ApiProperty({ example: '081234567', required: true })
  @IsNotEmpty()
  @IsString()
  @Length(5, 15)
  phone: string;

  @ApiProperty({ example: '1234567', required: true })
  @IsNotEmpty()
  @IsString()
  @Length(6, 12)
  password: string;

  @ApiProperty({ example: 'Your Name', required: true })
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  name: string;

  @ApiProperty({ example: 'youremail@host.com', required: true })
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  email: string;

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  role_id: number;
}
