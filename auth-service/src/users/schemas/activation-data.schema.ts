import validator from 'validator';
import { Schema, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ActivationData {
  @Prop({ required: true })
  activationToken: string;

  @Prop({ required: false })
  lastAttempt: number;

  @Prop({ required: true })
  activated?: boolean;
}
