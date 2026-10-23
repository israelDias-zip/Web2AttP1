import express, {Request, Response} from 'express';
import { ProductCategory } from '../entity/ProductCategories';
import { AppDataSource } from '../data-source';
import { PaginationService } from '../services/paginationService';

const router = express.Router();

//Criar a lista
router.get("/product-categories", async(req: Request, res: Response) => {
  try {
    const productCategoryRepository = AppDataSource.getRepository(ProductCategory);

    //Receber o número de página
    const page = Number(req.query.page) || 1;

    //Definir o número de itens por página
    const limit = Number(req.query.limit) || 10;

    //Resultado da paginação
    const result = await PaginationService.paginate(productCategoryRepository, page, limit, {id: "ASC"});

    //Retornar a resposta com as categorias de produto e informações de paginação
    res.status(200).json(result);
    return;

  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar categorias de produto!",
    });
    return;
  }
});

// Criar visualização de categorias de produto
router.get("/product-categories/:id", async(req: Request, res: Response) => {
  try {

    const { id } = req.params;
    const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
    const productCategory = await productCategoryRepository.findOneBy({id : Number(id)});

    if(!productCategory) {
      res.status(404).json({
        message: "Categoria de produto não encontrada!",
      });
      return;
    }

    res.status(200).json(productCategory);
    return;

  } catch (error) {
    res.status(500).json({
      message: "Erro ao visualizar categorias de produto!",
    });
    return;
  }
});

// Criar categoria de produto
router.post("/product-categories", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
    const productCategory = productCategoryRepository.create({ name: data.name });
    await productCategoryRepository.save(productCategory);

    res.status(201).json({
      message: "Categoria de produto criada com sucesso!",
      productCategory: productCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erro ao criar categoria de produto!",
    });
  }
});

// Atualizar categoria de produto
router.put("/product-categories/:id", async(req: Request, res: Response) => {
  try {

    const { id } = req.params;
    const data = req.body;

    const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
    const productCategory = await productCategoryRepository.findOneBy({id : Number(id)});

    if(!productCategory) {
      res.status(404).json({
        message: "Categoria de produto não encontrada!",
      });
      return;
    }

    // Atualizar os dados da categoria de produto
    productCategoryRepository.merge(productCategory, { name: data.name });

    //salvar as alterações no banco de dados
    const updatedProductCategory = await productCategoryRepository.save(productCategory);
    res.status(200).json({
      message: "Categoria de produto atualizada com sucesso!",
      productCategory: updatedProductCategory,
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar categoria de produto!",
    });
    return;
  }
});

// Deletar categoria de produto
router.delete("/product-categories/:id", async(req: Request, res: Response) => {
  try {

    const { id } = req.params;

    const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
    const productCategory = await productCategoryRepository.findOneBy({id : Number(id)});

    if(!productCategory) {
      res.status(404).json({
        message: "Categoria de produto não encontrada!",
      });
      return;
    }

    // Remover os dados da categoria de produto
    await productCategoryRepository.remove(productCategory);

    res.status(200).json({
      message: "Categoria de produto removida com sucesso!",
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao remover categoria de produto!",
    });
    return;
  }
});

export default router;
