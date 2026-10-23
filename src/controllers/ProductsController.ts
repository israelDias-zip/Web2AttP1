import express, {Request, Response} from 'express';
import { Product } from '../entity/Products';
import { ProductSituation } from '../entity/ProductSituations';
import { ProductCategory } from '../entity/ProductCategories';
import { AppDataSource } from '../data-source';
import { PaginationService } from '../services/paginationService';

const router = express.Router();

//Criar a lista
router.get("/products", async(req: Request, res: Response) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);

    //Receber o número de página
    const page = Number(req.query.page) || 1;

    //Definir o número de itens por página
    const limit = Number(req.query.limit) || 10;

    //Resultado da paginação, trazendo a situação e a categoria de cada produto
    const result = await PaginationService.paginate(productRepository, page, limit, {id: "ASC"}, {productSituation: true, productCategory: true});

    //Retornar a resposta com os produtos e informações de paginação
    res.status(200).json(result);
    return;

  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar produtos!",
    });
    return;
  }
});

// Criar visualização de produtos
router.get("/products/:id", async(req: Request, res: Response) => {
  try {

    const { id } = req.params;
    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({
      where: {id : Number(id)},
      relations: {productSituation: true, productCategory: true}
    });

    if(!product) {
      res.status(404).json({
        message: "Produto não encontrado!",
      });
      return;
    }

    res.status(200).json(product);
    return;

  } catch (error) {
    res.status(500).json({
      message: "Erro ao visualizar produto!",
    });
    return;
  }
});

// Criar produto
router.post("/products", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    //Verificar se a situação do produto informada existe
    const productSituationRepository = AppDataSource.getRepository(ProductSituation);
    const productSituation = await productSituationRepository.findOneBy({id: Number(data.productSituationId)});

    if(!productSituation) {
      res.status(404).json({
        message: "Situação de produto não encontrada!",
      });
      return;
    }

    //Verificar se a categoria do produto informada existe
    const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
    const productCategory = await productCategoryRepository.findOneBy({id: Number(data.productCategoryId)});

    if(!productCategory) {
      res.status(404).json({
        message: "Categoria de produto não encontrada!",
      });
      return;
    }

    const productRepository = AppDataSource.getRepository(Product);
    const product = productRepository.create({
      name: data.name,
      productSituation: productSituation,
      productCategory: productCategory,
    });
    await productRepository.save(product);

    res.status(201).json({
      message: "Produto criado com sucesso!",
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erro ao criar produto!",
    });
  }
});

// Atualizar produto
router.put("/products/:id", async(req: Request, res: Response) => {
  try {

    const { id } = req.params;
    const data = req.body;

    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({
      where: {id : Number(id)},
      relations: {productSituation: true, productCategory: true}
    });

    if(!product) {
      res.status(404).json({
        message: "Produto não encontrado!",
      });
      return;
    }

    //Se foi enviada uma nova situação, verificar se ela existe
    if(data.productSituationId !== undefined) {
      const productSituationRepository = AppDataSource.getRepository(ProductSituation);
      const productSituation = await productSituationRepository.findOneBy({id: Number(data.productSituationId)});

      if(!productSituation) {
        res.status(404).json({
          message: "Situação de produto não encontrada!",
        });
        return;
      }
      product.productSituation = productSituation;
    }

    //Se foi enviada uma nova categoria, verificar se ela existe
    if(data.productCategoryId !== undefined) {
      const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
      const productCategory = await productCategoryRepository.findOneBy({id: Number(data.productCategoryId)});

      if(!productCategory) {
        res.status(404).json({
          message: "Categoria de produto não encontrada!",
        });
        return;
      }
      product.productCategory = productCategory;
    }

    // Atualizar os dados do produto
    productRepository.merge(product, { name: data.name });

    //salvar as alterações no banco de dados
    const updatedProduct = await productRepository.save(product);
    res.status(200).json({
      message: "Produto atualizado com sucesso!",
      product: updatedProduct,
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar produto!",
    });
    return;
  }
});

// Deletar produto
router.delete("/products/:id", async(req: Request, res: Response) => {
  try {

    const { id } = req.params;

    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOneBy({id : Number(id)});

    if(!product) {
      res.status(404).json({
        message: "Produto não encontrado!",
      });
      return;
    }

    // Remover os dados do produto
    await productRepository.remove(product);

    res.status(200).json({
      message: "Produto removido com sucesso!",
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao remover produto!",
    });
    return;
  }
});

export default router;
