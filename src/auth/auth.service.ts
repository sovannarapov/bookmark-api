import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup() {
    return 'I am sign up';
  }

  signin() {
    return 'I am sign in';
  }
}
