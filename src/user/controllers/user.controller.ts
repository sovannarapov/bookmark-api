import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../../auth/decorator';
import { UserService } from '../services/user.service';
import { EditUserDto } from '../requests';
import { JwtGuard } from '../../auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private _userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    // If @GetUser() has param the return value is only one thing
    // Ex: @GetUser('email') it will return a user that has match with the param
    // It is get user by email
    return user;
  }

  @Patch(':id')
  editUser(@GetUser('id') userId: number, @Body() editUserDto: EditUserDto) {
    return this._userService.editUser(userId, editUserDto);
  }
}
