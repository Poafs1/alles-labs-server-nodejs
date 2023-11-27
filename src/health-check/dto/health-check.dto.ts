import { IsNotEmpty, IsNumber } from 'class-validator';

export class HealthCheckDto {
  @IsNumber()
  @IsNotEmpty()
  status: number;

  @IsNotEmpty()
  message: string;
}
