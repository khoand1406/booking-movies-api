import {
  IsEmail,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
export class CreateUserRPayload {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 50)
  password!: string;

  @IsString()
  username!: string;

  @IsString()
  phoneNumber!: string;
}

export class BulkCreateUserPayload {
    @ValidateNested({each: true})
    @Type(() => CreateUserRPayload)
    users!: CreateUserRPayload[];
}
