import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSuperadminToUserRole1727174510000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE "users_role_enum" ADD VALUE 'SUPERADMIN'
    `);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Note: PostgreSQL does not support removing enum values directly
    // You would need to recreate the type without the value
    // For simplicity, we'll leave it as is for down migration
  }
}
