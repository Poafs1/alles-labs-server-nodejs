import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { WorkflowEntity } from './entities/workflow.entity';
import { TaskEntity } from './entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, WorkflowEntity, TaskEntity])],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {}
