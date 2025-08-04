import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1754255904714 implements MigrationInterface {
    name = 'Init1754255904714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "name" varchar(50) NOT NULL, "type" text NOT NULL DEFAULT ('otro'), "description" varchar(255), "isDefault" boolean NOT NULL DEFAULT (1), "isActive" boolean NOT NULL DEFAULT (1), "userId" varchar, "parent_id" varchar)`);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "username" varchar(50) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar(255) NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "amount" decimal(10,2) NOT NULL, "currency" varchar(50) NOT NULL, "description" varchar(255), "user_id" varchar NOT NULL, "category_id" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_categories" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "name" varchar(50) NOT NULL, "type" text NOT NULL DEFAULT ('otro'), "description" varchar(255), "isDefault" boolean NOT NULL DEFAULT (1), "isActive" boolean NOT NULL DEFAULT (1), "userId" varchar, "parent_id" varchar, CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_88cea2dc9c31951d06437879b40" FOREIGN KEY ("parent_id") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_categories"("id", "created_at", "updated_at", "name", "type", "description", "isDefault", "isActive", "userId", "parent_id") SELECT "id", "created_at", "updated_at", "name", "type", "description", "isDefault", "isActive", "userId", "parent_id" FROM "categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`ALTER TABLE "temporary_categories" RENAME TO "categories"`);
        await queryRunner.query(`CREATE TABLE "temporary_transactions" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "amount" decimal(10,2) NOT NULL, "currency" varchar(50) NOT NULL, "description" varchar(255), "user_id" varchar NOT NULL, "category_id" varchar NOT NULL, CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE RESTRICT, CONSTRAINT "FK_c9e41213ca42d50132ed7ab2b0f" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE NO ACTION ON UPDATE RESTRICT)`);
        await queryRunner.query(`INSERT INTO "temporary_transactions"("id", "created_at", "updated_at", "amount", "currency", "description", "user_id", "category_id") SELECT "id", "created_at", "updated_at", "amount", "currency", "description", "user_id", "category_id" FROM "transactions"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`ALTER TABLE "temporary_transactions" RENAME TO "transactions"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" RENAME TO "temporary_transactions"`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "amount" decimal(10,2) NOT NULL, "currency" varchar(50) NOT NULL, "description" varchar(255), "user_id" varchar NOT NULL, "category_id" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "transactions"("id", "created_at", "updated_at", "amount", "currency", "description", "user_id", "category_id") SELECT "id", "created_at", "updated_at", "amount", "currency", "description", "user_id", "category_id" FROM "temporary_transactions"`);
        await queryRunner.query(`DROP TABLE "temporary_transactions"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME TO "temporary_categories"`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "name" varchar(50) NOT NULL, "type" text NOT NULL DEFAULT ('otro'), "description" varchar(255), "isDefault" boolean NOT NULL DEFAULT (1), "isActive" boolean NOT NULL DEFAULT (1), "userId" varchar, "parent_id" varchar)`);
        await queryRunner.query(`INSERT INTO "categories"("id", "created_at", "updated_at", "name", "type", "description", "isDefault", "isActive", "userId", "parent_id") SELECT "id", "created_at", "updated_at", "name", "type", "description", "isDefault", "isActive", "userId", "parent_id" FROM "temporary_categories"`);
        await queryRunner.query(`DROP TABLE "temporary_categories"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
