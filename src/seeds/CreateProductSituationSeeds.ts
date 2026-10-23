import {DataSource} from 'typeorm'
import { ProductSituation } from '../entity/ProductSituations';

export default class CreateProductSituationSeeds {

  public async run(dataSource: DataSource): Promise<void> {
    console.log('Iniciando a criação de seeds para a tabela "product_situations"...');

    const productSituationRepository = dataSource.getRepository(ProductSituation);
    const existingCount = await productSituationRepository.count();

    if (existingCount > 0) {
      console.log('A tabela "product_situations" já possui registros. Nenhuma seed será criada.');
      return;
    }

    const productSituationsData = [
      { name: 'Disponível' },
      { name: 'Indisponível' },
      { name: 'Esgotado' },
    ];

    await productSituationRepository.save(productSituationsData);
    console.log('Seeds para a tabela "product_situations" criadas com sucesso!');

  }

}
