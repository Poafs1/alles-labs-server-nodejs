import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProjectDto, ProjectInputDto } from './dto/project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { Repository } from 'typeorm';
import { WorkflowDto, WorkflowInputDto, WorkflowUpdateInputDto } from './dto/workflow.dto';
import { WorkflowEntity } from './entities/workflow.entity';
import { TaskEntity } from './entities/task.entity';
import { TaskCreateInputDto, TaskDto, TaskUpdateInputDto } from './dto/task.dto';

@Injectable()
export class CoreService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectEntity: Repository<ProjectEntity>,
    @InjectRepository(WorkflowEntity)
    private workflowEntity: Repository<WorkflowEntity>,
    @InjectRepository(TaskEntity)
    private taskEntity: Repository<TaskEntity>,
  ) {}

  private mapTask(task: TaskEntity): TaskDto {
    return {
      id: String(task.id),
      name: task.name,
      description: task.description,
      archived: task.archived,
      order: task.order,
      createdAt: task.created_at,
    };
  }

  private mapWorkflow(workflow: WorkflowEntity): WorkflowDto {
    return {
      id: String(workflow.id),
      title: workflow.title,
      titleId: workflow.title_id,
      order: workflow.order,
      tasks: workflow.tasks?.map((task) => this.mapTask(task)) || [],
    };
  }

  private mapProject(project: ProjectEntity): ProjectDto {
    return {
      id: String(project.id),
      name: project.name,
      nameId: project.name_id,
      coverImage: `https://api.dicebear.com/7.x/initials/svg?seed=${project.name_id}`,
      workflows: project.workflows?.map((workflow) => this.mapWorkflow(workflow)) || [],
    };
  }

  private convertToNameID = (str: string) => {
    const cleanStr = str.replace(/[^a-zA-Z0-9]+/g, '-');
    const trimmedStr = cleanStr.replace(/^-+|-+$/g, '');

    return trimmedStr;
  };

  async projects() {
    const foundProjects = await this.projectEntity.find();

    return foundProjects.map(this.mapProject);
  }

  async project(nameId: string) {
    const foundProject = await this.projectEntity
      .createQueryBuilder('project')
      .where('project.name_id = :nameId', { nameId })
      .leftJoinAndSelect('project.workflows', 'workflow')
      .leftJoinAndSelect('workflow.tasks', 'task')
      .orderBy('workflow.order')
      .addOrderBy('task.order')
      .getOne();

    if (!foundProject) {
      throw new InternalServerErrorException('Project not found');
    }

    return this.mapProject(foundProject);
  }

  async projectCreate(projectInputDto: ProjectInputDto) {
    const { name } = projectInputDto;

    const nameId = this.convertToNameID(name);

    const foundProject = await this.projectEntity.findOne({
      name_id: nameId,
    });

    if (foundProject) {
      throw new InternalServerErrorException('Project already exists');
    }

    const createdUser = await this.projectEntity.save(
      this.projectEntity.create({
        name,
        name_id: nameId,
      }),
    );

    // Init default workflows
    await this.workflowCreate(nameId, {
      title: 'To Do',
      order: 0,
    });

    await this.workflowCreate(nameId, {
      title: 'In Progress',
      order: 1,
    });

    await this.workflowCreate(nameId, {
      title: 'Done',
      order: 2,
    });

    return this.mapProject(createdUser);
  }

  async workflowCreate(nameId: string, workflowInputDto: WorkflowInputDto) {
    const { title, order } = workflowInputDto;

    const foundProject = await this.projectEntity.findOne({
      name_id: nameId,
    });

    if (!foundProject) {
      throw new InternalServerErrorException('Project not found');
    }

    const titleId = this.convertToNameID(title);

    const createdWorkflow = await this.workflowEntity.save(
      this.workflowEntity.create({
        title,
        title_id: titleId,
        order,
        project: foundProject,
      }),
    );

    if (!createdWorkflow) {
      throw new InternalServerErrorException('Workflow not created');
    }

    return this.mapWorkflow(createdWorkflow);
  }

  async workflowUpdate(
    nameId: string,
    workflowId: string,
    workflowUpdateInputDto: WorkflowUpdateInputDto,
  ) {
    const { title, destinationIndex, sourceIndex } = workflowUpdateInputDto;

    const foundProject = await this.projectEntity
      .createQueryBuilder('project')
      .where('project.name_id = :nameId', { nameId })
      .leftJoinAndSelect('project.workflows', 'workflow')
      .orderBy('workflow.order')
      .getOne();

    if (!foundProject) {
      throw new InternalServerErrorException('Project not found');
    }

    const foundWorkflow = foundProject.workflows.find(
      (workflow) => workflow.id === Number(workflowId),
    );

    if (!foundWorkflow) {
      throw new InternalServerErrorException('Workflow not found');
    }

    // Change title
    if (foundWorkflow.title !== title) {
      const titleId = this.convertToNameID(title);

      foundWorkflow.title = title;
      foundWorkflow.title_id = titleId;
    }

    // Change order
    if (sourceIndex !== destinationIndex) {
      foundProject.workflows.splice(sourceIndex, 1);
      foundProject.workflows.splice(destinationIndex, 0, foundWorkflow);

      foundProject.workflows.map((workflow, index) => {
        workflow.order = index;
      });
    }

    await this.workflowEntity.save(foundProject.workflows);

    return null;
  }

  async workflowDelete(nameId: string, workflowId: string) {
    const foundProject = await this.projectEntity.findOne({
      where: {
        name_id: nameId,
      },
    });

    if (!foundProject) {
      throw new InternalServerErrorException('Project not found');
    }

    const foundWorkflow = await this.workflowEntity.findOne({
      where: {
        id: workflowId,
      },
    });

    if (!foundWorkflow) {
      throw new InternalServerErrorException('Workflow not found');
    }

    // TODO: Check workflow not contain any tasks

    await this.workflowEntity.remove(foundWorkflow);

    return null;
  }

  async taskCreate(workflowId: string, taskCreateInputDto: TaskCreateInputDto) {
    const { name, description, order } = taskCreateInputDto;

    const foundWorkflow = await this.workflowEntity.findOne({
      where: {
        id: workflowId,
      },
    });

    if (!foundWorkflow) {
      throw new InternalServerErrorException('Workflow not found');
    }

    const createdTask = await this.taskEntity.save(
      this.taskEntity.create({
        name,
        description,
        workflow: foundWorkflow,
        order,
      }),
    );

    if (!createdTask) {
      throw new InternalServerErrorException('Task not created');
    }

    return this.mapTask(createdTask);
  }

  async taskUpdate(workflowId: string, taskId: string, taskUpdateInputDto: TaskUpdateInputDto) {
    const { name, description, archived, destinationIndex, sourceIndex, startListId, endListId } =
      taskUpdateInputDto;

    const foundTask = await this.taskEntity.findOne({
      where: {
        id: taskId,
      },
    });

    if (!foundTask) {
      throw new InternalServerErrorException('Task not found');
    }

    foundTask.name = name;
    foundTask.description = description;
    foundTask.archived = archived;

    await this.taskEntity.save(foundTask);

    // Move task
    if (sourceIndex !== destinationIndex || startListId !== endListId) {
      // Move task in same list
      if (Number(workflowId) === endListId) {
        const foundWorkflow = await this.workflowEntity
          .createQueryBuilder('workflow')
          .where('workflow.id = :workflowId', { workflowId })
          .leftJoinAndSelect('workflow.tasks', 'task')
          .orderBy('task.order')
          .getOne();

        if (!foundWorkflow) {
          throw new InternalServerErrorException('Workflow not found');
        }

        foundWorkflow.tasks.splice(sourceIndex, 1);
        foundWorkflow.tasks.splice(destinationIndex, 0, foundTask);

        foundWorkflow.tasks.map((task, index) => {
          task.order = index;
        });

        await this.taskEntity.save(foundWorkflow.tasks);
      } else {
        // Move task to another list
        const [foundFirstWorkflow, foundSecondWorkflow] = await Promise.all([
          this.workflowEntity
            .createQueryBuilder('workflow')
            .where('workflow.id = :workflowId', { workflowId })
            .leftJoinAndSelect('workflow.tasks', 'task')
            .orderBy('task.order')
            .getOne(),

          this.workflowEntity
            .createQueryBuilder('workflow')
            .where('workflow.id = :workflowId', { workflowId: endListId })
            .leftJoinAndSelect('workflow.tasks', 'task')
            .orderBy('task.order')
            .getOne(),
        ]);

        if (!foundFirstWorkflow || !foundSecondWorkflow) {
          throw new InternalServerErrorException('Workflow not found');
        }

        foundFirstWorkflow.tasks.splice(sourceIndex, 1);
        foundSecondWorkflow.tasks.splice(destinationIndex, 0, foundTask);

        foundFirstWorkflow.tasks.map((task, index) => {
          task.order = index;
          task.workflow_id = Number(workflowId);
        });

        foundSecondWorkflow.tasks.map((task, index) => {
          task.order = index;
          task.workflow_id = endListId;
        });

        await this.taskEntity.save(foundFirstWorkflow.tasks);
        await this.taskEntity.save(foundSecondWorkflow.tasks);
      }
    }

    return null;
  }
}
