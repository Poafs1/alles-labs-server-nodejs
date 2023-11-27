import { BaseAuditableEntity } from '../../sql/entities/baseAuditable.entity';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkflowEntity } from './workflow.entity';

@Entity({ name: 'project' })
export class ProjectEntity extends BaseAuditableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  @Index()
  name_id: string;

  @OneToMany(() => WorkflowEntity, (workflowEntity) => workflowEntity.project)
  workflows: WorkflowEntity[];
}
