import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TaskCreateInputDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;
}

export class TaskUpdateInputDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  destinationIndex: number;

  @IsNumber()
  @IsNotEmpty()
  sourceIndex: number;

  @IsNumber()
  @IsNotEmpty()
  startListId: number;

  @IsNumber()
  @IsNotEmpty()
  endListId: number;

  @IsBoolean()
  @IsNotEmpty()
  archived: boolean;
}

export class TaskDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  archived: boolean;

  @IsNumber()
  @IsNotEmpty()
  order: number;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;
}
