import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private _prisma: PrismaService) {}

  async signup(signUpDto: AuthDto) {
    try {
      // Generate the password hash
      const hashedPassword = await argon.hash(signUpDto.password);
      // Save user in DB
      const user = this._prisma.user.create({
        data: {
          email: signUpDto.email,
          password: hashedPassword,
        },
      });
      // Delete the password hash before return saved user
      delete (await user).password;
      // Return saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credential has already taken');
        }
      }
      throw error;
    }
  }

  async signin(signInDto: AuthDto) {
    // find the user by email
    const user = this._prisma.user.findUnique({
      where: {
        email: signInDto.email,
      },
    });
    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');
    // compare password
    const passwordMatches = await argon.verify(
      (
        await user
      ).password,
      signInDto.password,
    );
    // if password incorrect throw exception
    if (!passwordMatches) throw new ForbiddenException('Credentials incorrect');
    // send back the user
    delete (await user).password;
    return user;
  }
}
