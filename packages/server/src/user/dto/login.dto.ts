import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordLoginDto {
  @IsNotEmpty({ message: 'Phone cannot be empty!' })
  @IsString({ message: 'Phone must be a string!' })
  phone: string;

  @IsNotEmpty({ message: 'Password cannot be empty!' })
  @IsString({ message: 'Password must be a string!' })
  password: string;
}


export class SmsLoginDto {
  @IsNotEmpty({ message: 'Phone cannot be empty!' })
  @IsString({ message: 'Phone must be a string!' })
  phone: string;

  @IsNotEmpty({ message: 'SMS code cannot be empty!' })
  @IsString({ message: 'SMS code must be a string!' })
  smsCode: string;
}