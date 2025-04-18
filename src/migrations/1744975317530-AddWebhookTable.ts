import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWebhookTable1744975317530 implements MigrationInterface {
    name = 'AddWebhookTable1744975317530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "webhooks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "event" character varying NOT NULL, "collection" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_9e8795cfc899ab7bdaa831e8527" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "webhooks" ADD CONSTRAINT "FK_7dbbb3fa9d7ccab4925a67af414" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "webhooks" DROP CONSTRAINT "FK_7dbbb3fa9d7ccab4925a67af414"`);
        await queryRunner.query(`DROP TABLE "webhooks"`);
    }

}
