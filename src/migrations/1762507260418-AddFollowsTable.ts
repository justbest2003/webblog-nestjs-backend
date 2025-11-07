import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFollowsTable1762507260418 implements MigrationInterface {
    name = 'AddFollowsTable1762507260418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // [ลบออก] - articles, users, tags, users_favorites_articles
        // และ Foreign Keys ที่ซ้ำซ้อน ถูกสร้างไปแล้วใน Migration ก่อนหน้า

        // นี่คือคำสั่งเดียวที่ควรอยู่ในไฟล์นี้
        await queryRunner.query(`CREATE TABLE "follows" ("id" SERIAL NOT NULL, "followerId" integer NOT NULL, "followingId" integer NOT NULL, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // [ลบออก] - ลบ Foreign Keys และตารางที่ซ้ำซ้อน
        
        // นี่คือคำสั่งเดียวที่ควรอยู่ในไฟล์นี้
        await queryRunner.query(`DROP TABLE "follows"`);
    }

}