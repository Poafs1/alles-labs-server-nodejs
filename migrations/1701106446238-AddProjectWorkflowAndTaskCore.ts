import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectWorkflowAndTaskCore1701106446238 implements MigrationInterface {
  name = 'AddProjectWorkflowAndTaskCore1701106446238';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL DEFAULT false, "order" integer NOT NULL, "workflow_id" integer NOT NULL, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "workflow" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "title" character varying NOT NULL, "title_id" character varying NOT NULL, "order" integer NOT NULL, "project_id" integer NOT NULL, CONSTRAINT "PK_eb5e4cc1a9ef2e94805b676751b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_52c4de4c56608bd11d09c35b6b" ON "workflow" ("title_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_eeff5fe8b6c78ce6d289f7cda9" ON "workflow" ("project_id", "title_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying NOT NULL, "name_id" character varying NOT NULL, CONSTRAINT "UQ_5dc7a7d3535d5e177fdaa73a62b" UNIQUE ("name_id"), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5dc7a7d3535d5e177fdaa73a62" ON "project" ("name_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_68b093d83cffa48b930161039ff" FOREIGN KEY ("workflow_id") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow" ADD CONSTRAINT "FK_d9d448cbb31ee585001033a62b7" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow" DROP CONSTRAINT "FK_d9d448cbb31ee585001033a62b7"`,
    );
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_68b093d83cffa48b930161039ff"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5dc7a7d3535d5e177fdaa73a62"`);
    await queryRunner.query(`DROP TABLE "project"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_eeff5fe8b6c78ce6d289f7cda9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_52c4de4c56608bd11d09c35b6b"`);
    await queryRunner.query(`DROP TABLE "workflow"`);
    await queryRunner.query(`DROP TABLE "task"`);
  }
}
