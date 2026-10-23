import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameNameUserToNameInUsers1792720639934 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      // Renomear a coluna para seguir o diagrama do banco de dados
      await queryRunner.renameColumn("users", "nameUser", "name");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.renameColumn("users", "name", "nameUser");
    }

}
