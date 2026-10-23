import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateProductsTable1792720637822 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.createTable(new Table({
            name: "products",
            columns: [
              {
                name: "id",
                type: "int",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "increment"
              },
              {
                name: "name",
                type: "varchar",
              },
              {
                name: "productSituationId",
                type: "int",
              },
              {
                name: "productCategoryId",
                type: "int",
              },
              {
                name: "createdAt",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP"
              },
              {
                name: "updatedAt",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                onUpdate: "CURRENT_TIMESTAMP"
              }
            ]
          }));
            await queryRunner.createForeignKey(
                "products",
                new TableForeignKey({
                    columnNames: ["productSituationId"],
                    referencedTableName: "product_situations",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE"
                })
            );
            await queryRunner.createForeignKey(
                "products",
                new TableForeignKey({
                    columnNames: ["productCategoryId"],
                    referencedTableName: "product_categories",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE"
                })
            );
        }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("products");
        const situationForeignKey = table?.foreignKeys.find((fk) => fk.columnNames.includes("productSituationId"));
        if (situationForeignKey) {
            await queryRunner.dropForeignKey("products", situationForeignKey);
        }
        const categoryForeignKey = table?.foreignKeys.find((fk) => fk.columnNames.includes("productCategoryId"));
        if (categoryForeignKey) {
            await queryRunner.dropForeignKey("products", categoryForeignKey);
        }
        await queryRunner.dropTable("products");
    }

}
