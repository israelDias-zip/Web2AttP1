import { AppDataSource } from "./data-source";
import CreateSituationSeeds from "./seeds/CreateSituationSeeds";

const runSeeds = async () => {
  console.log('Conectando ao banco de dados...');

  await AppDataSource.initialize()
  console.log('Conexão com o banco de dados estabelecida com sucesso!');

  try {
    //Cria a instância da classe CreateSituationSeeds e executa o método run para criar as seeds
    const situationsSeeds = new CreateSituationSeeds();
    await situationsSeeds.run(AppDataSource);
  } catch (error) {
    console.error('Erro ao executar as seeds:', error);
  }finally {
    await AppDataSource.destroy();
    console.log('Conexão com o banco de dados encerrada.');
  }
};

runSeeds();