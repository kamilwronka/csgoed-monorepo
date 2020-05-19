import { Exclude } from 'class-transformer';

export class UserEntity {
  _id: string;
  firstName: string;
  lastName: string;

  @Exclude()
  password: string;
  @Exclude()
  createdAt: string;
  @Exclude()
  updatedAt: string;
  @Exclude()
  __v: number;
  @Exclude()
  activationKey: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
