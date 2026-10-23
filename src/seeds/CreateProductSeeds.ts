import {DataSource} from 'typeorm'
import { Product } from '../entity/Products';
import { ProductSituation } from '../entity/ProductSituations';
import { ProductCategory } from '../entity/ProductCategories';

export default class CreateProductSeeds {

  public async run(dataSource: DataSource): Promise<void> {
    console.log('Iniciando a criação de seeds para a tabela "products"...');

    const productRepository = dataSource.getRepository(Product);
    const existingCount = await productRepository.count();

    if (existingCount > 0) {
      console.log('A tabela "products" já possui registros. Nenhuma seed será criada.');
      return;
    }

    //Buscar as situações e categorias já cadastradas para relacionar com os produtos
    const productSituationRepository = dataSource.getRepository(ProductSituation);
    const disponivel = await productSituationRepository.findOneBy({ name: 'Disponível' });
    const esgotado = await productSituationRepository.findOneBy({ name: 'Esgotado' });

    const productCategoryRepository = dataSource.getRepository(ProductCategory);
    const eletronicos = await productCategoryRepository.findOneBy({ name: 'Eletrônicos' });
    const livros = await productCategoryRepository.findOneBy({ name: 'Livros' });
    const roupas = await productCategoryRepository.findOneBy({ name: 'Roupas' });

    if (!disponivel || !esgotado || !eletronicos || !livros || !roupas) {
      console.log('Situações ou categorias não encontradas. Execute primeiro as seeds de "product_situations" e "product_categories".');
      return;
    }

    const productsData = [
      { name: 'Notebook', productSituation: disponivel, productCategory: eletronicos },
      { name: 'Smartphone', productSituation: esgotado, productCategory: eletronicos },
      { name: 'Clean Code', productSituation: disponivel, productCategory: livros },
      { name: 'Camiseta', productSituation: disponivel, productCategory: roupas },
    ];

    await productRepository.save(productsData);
    console.log('Seeds para a tabela "products" criadas com sucesso!');

  }

}
