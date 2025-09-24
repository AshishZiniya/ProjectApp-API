import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccessTokenToUsers1694784000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Removed adding accessToken as it's not needed
    await queryRunner.query(`
      ALTER TABLE "tasks"
      ADD COLUMN IF NOT EXISTS "status" enum('TODO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TODO'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "accessToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP COLUMN IF EXISTS "status"`,
    );
  }
}
