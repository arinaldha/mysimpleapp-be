import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'myemail@host.com', required: true })
  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  email: string;

  @ApiProperty({ example: '123456', required: true })
  @IsNotEmpty()
  @IsString()
  @Length(6, 12)
  password: string;
}
