import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthCheckDto } from './dto/health-check.dto';

@Controller('health-check')
export class HealthCheckController {
  @Get('/')
  @HttpCode(HttpStatus.OK)
  healthCheck(): HealthCheckDto {
    return {
      status: HttpStatus.OK,
      message: 'success',
    };
  }
}
