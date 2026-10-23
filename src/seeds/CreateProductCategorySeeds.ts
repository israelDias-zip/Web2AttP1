import {DataSource} from 'typeorm'
import { ProductCategory } from '../entity/ProductCategories';

export default class CreateProductCategorySeeds {

  public async run(dataSource: DataSource): Promise<void> {
    console.log('Iniciando a criação de seeds para a tabela "product_categories"...');

    const productCategoryRepository = dataSource.getRepository(ProductCategory);
    const existingCount = await productCategoryRepository.count();

    if (existingCount > 0) {
      console.log('A tabela "product_categories" já possui registros. Nenhuma seed será criada.');
      return;
    }

    const productCategoriesData = [
      { name: 'Eletrônicos' },
      { name: 'Livros' },
      { name: 'Roupas' },
    ];

    await productCategoryRepository.save(productCategoriesData);
    console.log('Seeds para a tabela "product_categories" criadas com sucesso!');

  }

}
