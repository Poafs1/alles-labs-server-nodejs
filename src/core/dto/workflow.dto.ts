import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TaskDto } from './task.dto';

export class WorkflowInputDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;
}

export class WorkflowUpdateInputDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  destinationIndex: number;

  @IsNumber()
  @IsNotEmpty()
  sourceIndex: number;
}

export class WorkflowDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  titleId: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;

  tasks: TaskDto[];
}
