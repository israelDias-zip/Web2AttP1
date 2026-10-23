import { AppDataSource } from "./data-source";
import CreateSituationSeeds from "./seeds/CreateSituationSeeds";
import CreateUserSeeds from "./seeds/CreateUserSeeds";
import CreateProductSituationSeeds from "./seeds/CreateProductSituationSeeds";
import CreateProductCategorySeeds from "./seeds/CreateProductCategorySeeds";
import CreateProductSeeds from "./seeds/CreateProductSeeds";

const runSeeds = async () => {
  console.log('Conectando ao banco de dados...');

  await AppDataSource.initialize()
  console.log('Conexão com o banco de dados estabelecida com sucesso!');

  try {
    //Cria a instância da classe CreateSituationSeeds e executa o método run para criar as seeds
    const situationsSeeds = new CreateSituationSeeds();
    await situationsSeeds.run(AppDataSource);

    //Usuários dependem das situações, por isso são criados depois
    const usersSeeds = new CreateUserSeeds();
    await usersSeeds.run(AppDataSource);

    const productSituationsSeeds = new CreateProductSituationSeeds();
    await productSituationsSeeds.run(AppDataSource);

    const productCategoriesSeeds = new CreateProductCategorySeeds();
    await productCategoriesSeeds.run(AppDataSource);

    //Produtos dependem das situações e categorias de produto, por isso são criados por último
    const productsSeeds = new CreateProductSeeds();
    await productsSeeds.run(AppDataSource);
  } catch (error) {
    console.error('Erro ao executar as seeds:', error);
  }finally {
    await AppDataSource.destroy();
    console.log('Conexão com o banco de dados encerrada.');
  }
};

runSeeds();
