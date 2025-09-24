import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccessTokenToUsers1694784000000 implements MigrationInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Removed adding accessToken as it's not needed
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "accessToken"`,
    );
  }
}
