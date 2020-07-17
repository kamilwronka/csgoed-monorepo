import { Model } from 'mongoose';
import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
  Inject,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';

import { User } from './schemas/user.schema';
import { SignUpUserDto } from 'src/auth/dto/signup-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { extractMetadataFromRequest } from './helpers/extract-metadata-from-request';
import { Request } from 'express';
import { SignInUserDto } from 'src/auth/dto/signin-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userRepository: Model<User>,
    @Inject('EVENT_BUS') private eventBus: ClientProxy,
  ) {}
  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ email });
  }

  async findOneAndUpdate(query, updateQuery): Promise<User | undefined> {
    return this.userRepository.findOneAndUpdate(query, updateQuery);
  }

  async create(signUpUserDto: SignUpUserDto, request: Request) {
    let createdUser = new this.userRepository(signUpUserDto);
    createdUser.password = await bcrypt.hash(createdUser.password, 10);
    createdUser.activationData = {
      activationToken: this.generateActivationToken(createdUser._id),
      lastAttempt: 0,
    };
    createdUser.authHistory = [
      await extractMetadataFromRequest(request, signUpUserDto.fingerprint),
    ];

    try {
      const user = await createdUser.save();

      this.eventBus.emit('MAIL_SERVICE_CONFIRMATION_EMAIL', {
        email: createdUser.email,
        metadata: {
          token: createdUser.activationData.activationToken,
          name: createdUser.firstName + ' ' + createdUser.lastName,
          language: createdUser.language,
        },
      });

      return user;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async updateLoginData(signInUserDto: SignInUserDto, request: Request) {
    try {
      const metadata = await extractMetadataFromRequest(
        request,
        signInUserDto.fingerprint,
      );

      if (!this.checkIfNewBrowser(request.user, signInUserDto.fingerprint)) {
        const user = await this.userRepository.findOneAndUpdate(
          { _id: request.user['_id'] },
          { $push: { authHistory: metadata } },
          { new: true },
        );

        this.eventBus.emit('NEW_BROWSER_NOTIFICATION_EMAIL', {
          email: user.email,
          metadata: {
            name: user.firstName + ' ' + user.lastName,
            details: metadata,
            language: user.language,
          },
        });

        return user;
      }

      return request.user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  checkIfNewBrowser(userData, currentFingerprint: string): boolean {
    const existingBrowser = userData.authHistory.find(elem => {
      return elem.fingerprint === currentFingerprint;
    });

    return existingBrowser;
  }

  generateActivationToken(userId) {
    return uuid.v4() + userId;
  }

  async activateUser(token) {
    const user = await this.userRepository.findOneAndUpdate(
      { activationToken: token },
      {
        $set: {
          activationData: {
            activationToken: '',
            activated: true,
            lastAttempt: null,
          },
        },
      },
    );

    if (!user) {
      throw new BadRequestException();
    }

    return { message: 'User has been activated.' };
  }

  async resendActivationEmail(user: User) {
    if (user.activationData.lastAttempt + 60 * 1000 * 15 >= Date.now()) {
      throw new BadRequestException('pages.accountActivationPage.timeoutError');
    }

    if (!user || user.activationData.activated) {
      throw new BadRequestException(
        'pages.accountActivationPage.accountAlreadyActivated',
      );
    }

    const token = this.generateActivationToken(user._id);
    const updatedUser = await this.userRepository.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          activationData: { activationToken: token, lastAttempt: Date.now() },
        },
      },
      { new: true },
    );

    this.eventBus.emit('MAIL_SERVICE_ACTIVATION_EMAIL', {
      email: updatedUser.email,
      metadata: {
        token: updatedUser.activationData.activationToken,
        name: updatedUser.firstName + ' ' + updatedUser.lastName,
        language: updatedUser.language,
      },
    });
  }
}
