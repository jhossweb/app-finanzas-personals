import { MigrationInterface, QueryRunner } from "typeorm";

export class Roles1754267751441 implements MigrationInterface {
    name = 'Roles1754267751441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "username" varchar(50) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar(255) NOT NULL, "role" varchar CHECK( "role" IN ('USER','ADMIN') ) NOT NULL DEFAULT ('USER'), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "created_at", "updated_at", "username", "email", "password") SELECT "id", "created_at", "updated_at", "username", "email", "password" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "username" varchar(50) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar(255) NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "created_at", "updated_at", "username", "email", "password") SELECT "id", "created_at", "updated_at", "username", "email", "password" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
    }

}
