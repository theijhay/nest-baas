import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldToUser1745632187593 implements MigrationInterface {
    name = 'AddFieldToUser1745632187593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "scope" character varying NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "scope"`);
    }

}
