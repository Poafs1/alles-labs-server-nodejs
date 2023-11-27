import { IsNotEmpty, IsString } from 'class-validator';
import { WorkflowDto } from './workflow.dto';

export class ProjectInputDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ProjectDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  nameId: string;

  @IsString()
  @IsNotEmpty()
  coverImage: string;

  workflows: WorkflowDto[];
}
