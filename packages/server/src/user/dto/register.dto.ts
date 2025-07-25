import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Phone cannot be empty!' })
  @IsString({ message: 'Phone must be a string!' })
  phone: string;

  @IsNotEmpty({ message: 'SMS code cannot be empty!' })
  @IsString({ message: 'SMS code must be a string!' })
  smsCode: string;

  @IsNotEmpty({ message: 'Password cannot be empty!' })
  @IsString({ message: 'Password must be a string!' })
  password: string;

  @IsNotEmpty({ message: 'Confirm password cannot be empty!' })
  @IsString({ message: 'Confirm password must be a string!' })
  confirmPassword: string;
}