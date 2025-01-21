import { Body, Controller, HttpStatus, Post, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './auth.schema';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Usuário, após seu cadastro, faça login aqui',
  })
  @Post('login')
  @ApiBody({ type: SignInDto })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
