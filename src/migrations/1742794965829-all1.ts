import { MigrationInterface, QueryRunner } from "typeorm";

export class All11742794965829 implements MigrationInterface {
    name = 'All11742794965829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "is_active" SET DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "is_active" SET DEFAULT false`);
    }

}
