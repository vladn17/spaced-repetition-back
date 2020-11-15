import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserInputError } from 'apollo-server-fastify';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (!user) throw new UserInputError('Incorrect email or password');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UserInputError('Incorrect email or password');
    const token = await this.jwtService.signAsync({ userId: user.id });
    return token;
  }

  async signUp(email: string, password: string) {
    const existingEmail = await this.usersService.findOne(email);
    if (existingEmail) throw new UserInputError('This email already exists');
    const hash = await bcrypt.hash(password, 8);
    await this.usersService.create(email, hash);
    return 'success';
  }
}
