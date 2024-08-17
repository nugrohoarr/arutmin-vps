import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Public } from '../common/decorators';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('/')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/users/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto, @Res() res: any): Promise<Tokens> {
    try {
      const tokens = await this.authService.login(dto);
      res.header('Authorization', `Bearer ${tokens.access_token}`);
      return res.status(HttpStatus.OK).json({ message: 'Login successful',token: tokens.access_token });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }
  }

  @Put('change-password')
  async changePassword(
    @Req() req: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res() res: any
  ) {
    try {
      const { oldPassword, newPassword } = updatePasswordDto;
      await this.authService.changePassword(req, oldPassword, newPassword);
      return res.status(HttpStatus.OK).json({ message: 'Password changed successfully'});
    } catch (error) {
      return { error: error.message };
    }
  }
}