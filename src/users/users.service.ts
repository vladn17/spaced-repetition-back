import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findOne(email: string) {
    return this.userRepository.findOne({ email });
  }

  async create(email: string, passwordHash: string) {
    const user = this.userRepository.create({
      email,
      password: passwordHash,
    });
    const result = await this.userRepository.save(user);
    return result;
  }
}
