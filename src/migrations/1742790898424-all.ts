import { MigrationInterface, QueryRunner } from "typeorm";

export class All1742790898424 implements MigrationInterface {
    name = 'All1742790898424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "is_active" SET DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "is_active" SET DEFAULT false`);
    }

}
