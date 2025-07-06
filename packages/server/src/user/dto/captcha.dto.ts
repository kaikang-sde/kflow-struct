import { IsNotEmpty, IsString } from 'class-validator';

export class CaptchaDto {
  @IsNotEmpty({ message: 'Type cannot be empty!' })
  @IsString({ message: 'Type must be a string!' })
  type: string;
}