import { BaseAuditableEntity } from '../../sql/entities/baseAuditable.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WorkflowEntity } from './workflow.entity';

@Entity({ name: 'task' })
export class TaskEntity extends BaseAuditableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: false })
  archived: boolean;

  @Column()
  order: number;

  @Column()
  workflow_id: number;

  @ManyToOne(() => WorkflowEntity, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'workflow_id' })
  workflow: WorkflowEntity;
}
