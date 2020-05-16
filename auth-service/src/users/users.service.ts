import { Model } from 'mongoose';
import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { User } from './schemas/user.schema';
import { SignUpUserDto } from 'src/auth/dto/signup-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userRepository: Model<User>,
  ) {}
  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ email });
  }

  async create(signUpUserDto: SignUpUserDto) {
    let createdUser = new this.userRepository(signUpUserDto);
    createdUser.password = await bcrypt.hash(createdUser.password, 10);

    try {
      return await createdUser.save();
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}
