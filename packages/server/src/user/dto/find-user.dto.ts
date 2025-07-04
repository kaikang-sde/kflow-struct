import { IsNumber, IsNotEmpty } from 'class-validator';

export class FindUserDto {
  @IsNotEmpty({ message: 'Id cannot be empty!' })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: 'Id must be a number!' },
  )
  id: number;
}