import express, {Request, Response} from 'express';
import * as yup from 'yup';
import { ProductSituation } from '../entity/ProductSituations';
import { AppDataSource } from '../data-source';
import { PaginationService } from '../services/paginationService';

const router = express.Router();

//Criar a lista
router.get("/product-situations", async(req: Request, res: Response) => {
  try {
    const productSituationRepository = AppDataSource.getRepository(ProductSituation);

    //Receber o número de página
    const page = Number(req.query.page) || 1;

    //Definir o número de itens por página
    const limit = Number(req.query.limit) || 10;

    //Resultado da paginação
    const result = await PaginationService.paginate(productSituationRepository, page, limit, {id: "ASC"});

    //Retornar a resposta com as situações de produto e informações de paginação
    res.status(200).json(result);
    return;

  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar situações de produto!",
    });
    return;
  }
});

// Criar visualização de situações de produto
router.get("/product-situations/:id", async(req: Request, res: Response) => {
  try {

    const { id } = req.params;
    const productSituationRepository = AppDataSource.getRepository(ProductSituation);
    const productSituation = await productSituationRepository.findOneBy({id : Number(id)});

    if(!productSituation) {
      res.status(404).json({
        message: "Situação de produto não encontrada!",
      });
      return;
    }

    res.status(200).json(productSituation);
    return;

  } catch (error) {
    res.status(500).json({
      message: "Erro ao visualizar situações de produto!",
    });
    return;
  }
});

// Criar situação de produto
router.post("/product-situations", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    //Validar os dados recebidos
    const schema = yup.object({
      name: yup.string()
        .required("O campo nome da situação de produto é obrigatório!")
        .min(3, "O campo nome da situação de produto deve ter no mínimo 3 caracteres!"),
    });

    await schema.validate(data, { abortEarly: false });

    const productSituationRepository = AppDataSource.getRepository(ProductSituation);
    const productSituation = productSituationRepository.create({ name: data.name });
    await productSituationRepository.save(productSituation);

    res.status(201).json({
      message: "Situação de produto criada com sucesso!",
      productSituation: productSituation,
    });
  } catch (error) {
    //Retornar os erros de validação do yup
    if (error instanceof yup.ValidationError) {
      res.status(400).json({
        message: error.errors,
      });
      return;
    }

    console.log(error);
    res.status(500).json({
      message: "Erro ao criar situação de produto!",
    });
  }
});

// Atualizar situação de produto
router.put("/product-situations/:id", async(req: Request, res: Response) => {
  try {

    const { id } = req.params;
    const data = req.body;

    //Validar os dados recebidos
    const schema = yup.object({
      name: yup.string()
        .required("O campo nome da situação de produto é obrigatório!")
        .min(3, "O campo nome da situação de produto deve ter no mínimo 3 caracteres!"),
    });

    await schema.validate(data, { abortEarly: false });

    const productSituationRepository = AppDataSource.getRepository(ProductSituation);
    const productSituation = await productSituationRepository.findOneBy({id : Number(id)});

    if(!productSituation) {
      res.status(404).json({
        message: "Situação de produto não encontrada!",
      });
      return;
    }

    // Atualizar os dados da situação de produto
    productSituationRepository.merge(productSituation, { name: data.name });

    //salvar as alterações no banco de dados
    const updatedProductSituation = await productSituationRepository.save(productSituation);
    res.status(200).json({
      message: "Situação de produto atualizada com sucesso!",
      productSituation: updatedProductSituation,
    });

  } catch (error) {
    //Retornar os erros de validação do yup
    if (error instanceof yup.ValidationError) {
      res.status(400).json({
        message: error.errors,
      });
      return;
    }

    res.status(500).json({
      message: "Erro ao atualizar situação de produto!",
    });
    return;
  }
});

// Deletar situação de produto
router.delete("/product-situations/:id", async(req: Request, res: Response) => {
  try {

    const { id } = req.params;

    const productSituationRepository = AppDataSource.getRepository(ProductSituation);
    const productSituation = await productSituationRepository.findOneBy({id : Number(id)});

    if(!productSituation) {
      res.status(404).json({
        message: "Situação de produto não encontrada!",
      });
      return;
    }

    // Remover os dados da situação de produto
    await productSituationRepository.remove(productSituation);

    res.status(200).json({
      message: "Situação de produto removida com sucesso!",
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao remover situação de produto!",
    });
    return;
  }
});

export default router;
