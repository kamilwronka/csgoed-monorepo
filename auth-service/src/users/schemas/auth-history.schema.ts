import validator from 'validator';
import { Schema, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AuthHistory {
  @Prop({ required: true })
  ip: string | string[];

  @Prop({ required: true })
  date: string;

  @Prop({ required: false })
  localization: string | string[];

  @Prop({ required: false })
  device: {};

  @Prop({ required: false })
  fingerprint: string;
}
