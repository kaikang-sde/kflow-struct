import { IsNotEmpty, IsString } from "class-validator";

export class TextCodeDto {
    // type: login, register, change...
    @IsNotEmpty({ message: 'Type cannot be empty!' })
    @IsString({ message: 'Type must be a string!' })
    type: string;

    @IsNotEmpty({ message: 'Phone cannot be empty!' })
    @IsString({ message: 'Phone must be a string!' })
    phone: string;

    @IsNotEmpty({ message: 'Captcha cannot be empty!' })
    @IsString({ message: 'Captcha must be a string!' })
    captcha: string;
}