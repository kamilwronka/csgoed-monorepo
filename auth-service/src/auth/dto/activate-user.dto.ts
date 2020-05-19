import { IsNotEmpty } from 'class-validator';

export class ActivateUserDto {
  @IsNotEmpty()
  token: string;
}
