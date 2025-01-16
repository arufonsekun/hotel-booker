import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    description: 'The user email',
    type: String,
    required: true,
    example: 'name@company.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The user password',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  password: string;
}
