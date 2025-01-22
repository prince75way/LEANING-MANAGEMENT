import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1737551125594 implements MigrationInterface {
    name = 'Migrations1737551125594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "instructor" text NOT NULL, "price" numeric NOT NULL, "modules" text, "category" character varying, "image" character varying, "enrolledStudents" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "instructors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "qualifications" text NOT NULL, "experience" character varying(255) NOT NULL, "accessToken" character varying, "refreshToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1b1988548964fedf9892f63ec76" UNIQUE ("email"), CONSTRAINT "PK_95e3da69ca76176ea4ab8435098" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "course_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "watchedModules" text NOT NULL, "userId" uuid, "courseId" uuid, CONSTRAINT "PK_eadd1b31d44023e533eb847c4f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "role" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "accessToken" character varying, "refreshToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "modules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "contentText" text NOT NULL, "videoUrl" character varying(255) NOT NULL, "courseId" text NOT NULL, CONSTRAINT "PK_7dbefd488bd96c5bf31f0ce0c95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "course_progress" ADD CONSTRAINT "FK_29a49682b3b764662029ec6a1cb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_progress" ADD CONSTRAINT "FK_2cfdeb07b732bd12041e29bf328" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_progress" DROP CONSTRAINT "FK_2cfdeb07b732bd12041e29bf328"`);
        await queryRunner.query(`ALTER TABLE "course_progress" DROP CONSTRAINT "FK_29a49682b3b764662029ec6a1cb"`);
        await queryRunner.query(`DROP TABLE "modules"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "course_progress"`);
        await queryRunner.query(`DROP TABLE "instructors"`);
        await queryRunner.query(`DROP TABLE "courses"`);
    }

}
