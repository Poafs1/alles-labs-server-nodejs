import { BaseAuditableEntity } from '../../sql/entities/baseAuditable.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectEntity } from './project.entity';
import { TaskEntity } from './task.entity';

@Entity({ name: 'workflow' })
@Index(['project_id', 'title_id'], { unique: true })
export class WorkflowEntity extends BaseAuditableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  @Index()
  title_id: string;

  @Column()
  order: number;

  @Column()
  project_id: number;

  @ManyToOne(() => ProjectEntity, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @OneToMany(() => TaskEntity, (taskEntity) => taskEntity.workflow)
  tasks: TaskEntity[];
}
