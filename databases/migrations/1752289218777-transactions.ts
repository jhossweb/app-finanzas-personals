import { MigrationInterface, QueryRunner } from "typeorm";

export class Transactions1752289218777 implements MigrationInterface {
    name = 'Transactions1752289218777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transactions" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "amount" decimal(10,2) NOT NULL, "currency" varchar(50) NOT NULL, "description" varchar(255), "user_id" varchar NOT NULL, "category_id" varchar NOT NULL)`);
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
        await queryRunner.query(`DROP TABLE "transactions"`);
    }

}
