import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EditUserDto } from '../requests';

@Injectable()
export class UserService {
  constructor(private _prismaService: PrismaService) {}

  async editUser(userId: number, editUserDto: EditUserDto) {
    const user = await this._prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...editUserDto,
      },
    });

    delete user.password;

    return user;
  }
}
