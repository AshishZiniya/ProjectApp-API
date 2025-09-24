import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusToTasks1737150000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tasks"
      ADD COLUMN IF NOT EXISTS "status" enum('TODO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TODO'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP COLUMN IF EXISTS "status"`,
    );
  }
}
