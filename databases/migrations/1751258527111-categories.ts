import { MigrationInterface, QueryRunner } from "typeorm";

export class Categories1751258527111 implements MigrationInterface {
    name = 'Categories1751258527111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_categories" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "name" varchar(50) NOT NULL, "type" text NOT NULL DEFAULT ('otro'), "description" varchar(255), "user_id" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_categories"("id", "created_at", "updated_at", "name", "type", "description", "user_id") SELECT "id", "created_at", "updated_at", "name", "type", "description", "user_id" FROM "categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`ALTER TABLE "temporary_categories" RENAME TO "categories"`);
        await queryRunner.query(`CREATE TABLE "temporary_categories" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "name" varchar(50) NOT NULL, "type" text NOT NULL DEFAULT ('otro'), "description" varchar(255))`);
        await queryRunner.query(`INSERT INTO "temporary_categories"("id", "created_at", "updated_at", "name", "type", "description") SELECT "id", "created_at", "updated_at", "name", "type", "description" FROM "categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`ALTER TABLE "temporary_categories" RENAME TO "categories"`);
        await queryRunner.query(`CREATE TABLE "temporary_categories" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "name" varchar(50) NOT NULL, "type" text NOT NULL DEFAULT ('otro'), "description" varchar(255), "isDefault" boolean NOT NULL DEFAULT (1), "userId" varchar, "parent_id" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_categories"("id", "created_at", "updated_at", "name", "type", "description") SELECT "id", "created_at", "updated_at", "name", "type", "description" FROM "categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`ALTER TABLE "temporary_categories" RENAME TO "categories"`);
        await queryRunner.query(`CREATE TABLE "temporary_categories" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "name" varchar(50) NOT NULL, "type" text NOT NULL DEFAULT ('otro'), "description" varchar(255), "isDefault" boolean NOT NULL DEFAULT (1), "userId" varchar, "parent_id" varchar, CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_88cea2dc9c31951d06437879b40" FOREIGN KEY ("parent_id") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_categories"("id", "created_at", "updated_at", "name", "type", "description", "isDefault", "userId", "parent_id") SELECT "id", "created_at", "updated_at", "name", "type", "description", "isDefault", "userId", "parent_id" FROM "categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`ALTER TABLE "temporary_categories" RENAME TO "categories"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" RENAME TO "temporary_categories"`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "name" varchar(50) NOT NULL, "type" text NOT NULL DEFAULT ('otro'), "description" varchar(255), "isDefault" boolean NOT NULL DEFAULT (1), "userId" varchar, "parent_id" varchar)`);
        await queryRunner.query(`INSERT INTO "categories"("id", "created_at", "updated_at", "name", "type", "description", "isDefault", "userId", "parent_id") SELECT "id", "created_at", "updated_at", "name", "type", "description", "isDefault", "userId", "parent_id" FROM "temporary_categories"`);
        await queryRunner.query(`DROP TABLE "temporary_categories"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME TO "temporary_categories"`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "name" varchar(50) NOT NULL, "type" text NOT NULL DEFAULT ('otro'), "description" varchar(255))`);
        await queryRunner.query(`INSERT INTO "categories"("id", "created_at", "updated_at", "name", "type", "description") SELECT "id", "created_at", "updated_at", "name", "type", "description" FROM "temporary_categories"`);
        await queryRunner.query(`DROP TABLE "temporary_categories"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME TO "temporary_categories"`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "name" varchar(50) NOT NULL, "type" text NOT NULL DEFAULT ('otro'), "description" varchar(255), "user_id" varchar)`);
        await queryRunner.query(`INSERT INTO "categories"("id", "created_at", "updated_at", "name", "type", "description") SELECT "id", "created_at", "updated_at", "name", "type", "description" FROM "temporary_categories"`);
        await queryRunner.query(`DROP TABLE "temporary_categories"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME TO "temporary_categories"`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "name" varchar(50) NOT NULL, "type" text NOT NULL DEFAULT ('otro'), "description" varchar(255), "user_id" varchar, CONSTRAINT "FK_2296b7fe012d95646fa41921c8b" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "categories"("id", "created_at", "updated_at", "name", "type", "description", "user_id") SELECT "id", "created_at", "updated_at", "name", "type", "description", "user_id" FROM "temporary_categories"`);
        await queryRunner.query(`DROP TABLE "temporary_categories"`);
    }

}
