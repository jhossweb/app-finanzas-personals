import { MigrationInterface, QueryRunner } from "typeorm";

export class CambioEstructuraCategorias1761621072970 implements MigrationInterface {
    name = 'CambioEstructuraCategorias1761621072970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_categories" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "name" varchar(50) NOT NULL, "type" text NOT NULL DEFAULT ('otro'), "description" varchar(255), "isDefault" boolean NOT NULL DEFAULT (1), "isActive" boolean NOT NULL DEFAULT (1), "userId" varchar, "parent_id" varchar, CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_categories"("id", "created_at", "updated_at", "name", "type", "description", "isDefault", "isActive", "userId", "parent_id") SELECT "id", "created_at", "updated_at", "name", "type", "description", "isDefault", "isActive", "userId", "parent_id" FROM "categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`ALTER TABLE "temporary_categories" RENAME TO "categories"`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "username" varchar(50) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar(255) NOT NULL, "role" varchar CHECK( "role" IN ('USER','ADMIN') ) NOT NULL DEFAULT ('USER'), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "created_at", "updated_at", "username", "email", "password", "role") SELECT "id", "created_at", "updated_at", "username", "email", "password", "role" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`CREATE TABLE "temporary_categories" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "name" varchar(50) NOT NULL, "description" varchar(255), "isActive" boolean NOT NULL DEFAULT (1), "userId" varchar, CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_categories"("id", "created_at", "updated_at", "name", "description", "isActive", "userId") SELECT "id", "created_at", "updated_at", "name", "description", "isActive", "userId" FROM "categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`ALTER TABLE "temporary_categories" RENAME TO "categories"`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "username" varchar(50) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar(255) NOT NULL, "role" varchar CHECK( "role" IN ('USER','ADMIN') ) NOT NULL DEFAULT ('USER'), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "created_at", "updated_at", "username", "email", "password", "role") SELECT "id", "created_at", "updated_at", "username", "email", "password", "role" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "username" varchar(50) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar(255) NOT NULL, "role" varchar CHECK( "role" IN ('USER','ADMIN') ) NOT NULL DEFAULT ('USER'), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "created_at", "updated_at", "username", "email", "password", "role") SELECT "id", "created_at", "updated_at", "username", "email", "password", "role" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME TO "temporary_categories"`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "name" varchar(50) NOT NULL, "type" text NOT NULL DEFAULT ('otro'), "description" varchar(255), "isDefault" boolean NOT NULL DEFAULT (1), "isActive" boolean NOT NULL DEFAULT (1), "userId" varchar, "parent_id" varchar, CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "categories"("id", "created_at", "updated_at", "name", "description", "isActive", "userId") SELECT "id", "created_at", "updated_at", "name", "description", "isActive", "userId" FROM "temporary_categories"`);
        await queryRunner.query(`DROP TABLE "temporary_categories"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "username" varchar(50) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar(255) NOT NULL, "role" varchar CHECK( "role" IN ('USER','ADMIN') ) NOT NULL DEFAULT ('USER'), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "created_at", "updated_at", "username", "email", "password", "role") SELECT "id", "created_at", "updated_at", "username", "email", "password", "role" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME TO "temporary_categories"`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "name" varchar(50) NOT NULL, "type" text NOT NULL DEFAULT ('otro'), "description" varchar(255), "isDefault" boolean NOT NULL DEFAULT (1), "isActive" boolean NOT NULL DEFAULT (1), "userId" varchar, "parent_id" varchar, CONSTRAINT "FK_88cea2dc9c31951d06437879b40" FOREIGN KEY ("parent_id") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "categories"("id", "created_at", "updated_at", "name", "type", "description", "isDefault", "isActive", "userId", "parent_id") SELECT "id", "created_at", "updated_at", "name", "type", "description", "isDefault", "isActive", "userId", "parent_id" FROM "temporary_categories"`);
        await queryRunner.query(`DROP TABLE "temporary_categories"`);
    }

}
