import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class UpdateUsersDto {
  @ApiProperty({ example: 'Male', required: true })
  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  gender: string;

  @ApiProperty({ example: '081234567', required: true })
  @IsNotEmpty()
  @IsString()
  @Length(5, 15)
  phone: string;

  @ApiProperty({ example: '1234567' })
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
