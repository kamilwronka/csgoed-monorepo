import validator from 'validator';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  password: string;

  @Prop({ required: true, validate: validator.isEmail, unique: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
