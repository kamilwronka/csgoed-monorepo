import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './schemas/user.schema';
import { SignUpUserDto } from 'src/auth/dto/signup-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email });
  }

  async create(signUpUserDto: SignUpUserDto) {
    let createdUser = new this.userModel(signUpUserDto);

    return await createdUser.save();
  }
}
