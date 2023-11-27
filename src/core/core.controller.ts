import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProjectDto, ProjectInputDto } from './dto/project.dto';
import { CoreService } from './core.service';
import { WorkflowDto, WorkflowInputDto, WorkflowUpdateInputDto } from './dto/workflow.dto';
import { TaskCreateInputDto, TaskUpdateInputDto } from './dto/task.dto';

@Controller('core')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Get('projects')
  async projects() {
    return this.coreService.projects();
  }

  @Get('projects/:nameId')
  async project(@Param('nameId') nameId: string) {
    return this.coreService.project(nameId);
  }

  @Post('projects')
  async projectCreate(@Body() projectInputDto: ProjectInputDto): Promise<ProjectDto> {
    return this.coreService.projectCreate(projectInputDto);
  }

  @Post('projects/:nameId/workflows')
  async workflowCreate(
    @Param('nameId') nameId: string,
    @Body() workflowInputDto: WorkflowInputDto,
  ): Promise<WorkflowDto> {
    return this.coreService.workflowCreate(nameId, workflowInputDto);
  }

  @Put('projects/:nameId/workflows/:id')
  async workflowUpdate(
    @Param('nameId') nameId: string,
    @Param('id') id: string,
    @Body() workflowUpdateInputDto: WorkflowUpdateInputDto,
  ): Promise<WorkflowDto> {
    return this.coreService.workflowUpdate(nameId, id, workflowUpdateInputDto);
  }

  @Delete('projects/:nameId/workflows/:id')
  async workflowDelete(@Param('nameId') nameId: string, @Param('id') id: string) {
    return this.coreService.workflowDelete(nameId, id);
  }

  @Post('workflows/:workflowId/tasks')
  async taskCreate(
    @Param('workflowId') workflowId: string,
    @Body() taskCreateInputDto: TaskCreateInputDto,
  ) {
    return this.coreService.taskCreate(workflowId, taskCreateInputDto);
  }

  @Put('workflows/:workflowId/tasks/:id')
  async taskUpdate(
    @Param('workflowId') workflowId: string,
    @Param('id') id: string,
    @Body() taskUpdateInputDto: TaskUpdateInputDto,
  ) {
    return this.coreService.taskUpdate(workflowId, id, taskUpdateInputDto);
  }
}
