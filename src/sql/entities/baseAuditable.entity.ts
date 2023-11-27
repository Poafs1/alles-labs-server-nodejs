import { Column, UpdateDateColumn } from 'typeorm';

export abstract class BaseAuditableEntity {
  @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
