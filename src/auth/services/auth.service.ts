import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from '../dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private _prisma: PrismaService,
    private _jwtService: JwtService,
    private _configService: ConfigService,
  ) {}

  async signup(signUpDto: AuthDto) {
    try {
      // Generate the password hash
      const hashedPassword = await argon.hash(signUpDto.password);
      // Save user in DB
      const user = await this._prisma.user.create({
        data: {
          email: signUpDto.email,
          password: hashedPassword,
        },
      });
      // Return saved user
      return this.signToken(user.id, user.email);
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
    const user = await this._prisma.user.findUnique({
      where: {
        email: signInDto.email,
      },
    });
    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');
    // compare password
    const passwordMatches = await argon.verify(
      user.password,
      signInDto.password,
    );
    // if password incorrect throw exception
    if (!passwordMatches) throw new ForbiddenException('Credentials incorrect');
    // send back the user
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    // JWT secret
    const secret = this._configService.get('JWT_SECRET');
    // Token
    const token = await this._jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });
    // Return token as an object
    return {
      access_token: token,
    };
  }
}
