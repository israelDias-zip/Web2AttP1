import express, {Request, Response} from 'express';
import { Situation } from '../entity/Situations';
import { AppDataSource } from '../data-source';

const router = express.Router();

//Criar a lista
router.get("/situations", async(req: Request, res: Response) => {
  try {
    const situationRepository = AppDataSource.getRepository(Situation);
     const situations = await situationRepository.find();
     res.status(200).json(situations);
     return;
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar situações!",
    });
    return;
  }
});

// Criar visualização de situações
router.get("/situations/:id", async(req: Request, res: Response) => {
  try {

    const { id } = req.params;
    const situationRepository = AppDataSource.getRepository(Situation);
    //Tive que alterar para number pois o parseInt estava dando conflito com a minha versão do Express
     const situations = await situationRepository.findOneBy({id : Number(id)});

      if(!situations) {
        res.status(404).json({
          message: "Situação não encontrada!",
        });
        return;
      }

     res.status(200).json(situations);
     return;

  } catch (error) {
    res.status(500).json({
      message: "Erro ao visualizar situações!",
    });
    return;
  }
});

router.post("/situations", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const situationRepository = AppDataSource.getRepository(Situation);
    const situation = situationRepository.create({ nameSituation: data.nameSituation });
    await situationRepository.save(situation);

    res.status(201).json({
      message: "Situação criada com sucesso!",
      situation: situation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erro ao criar situação!",
    });
  }
});

// Atualizar situação
router.put("/situations/:id", async(req: Request, res: Response) => {
  try {

    const { id } = req.params;
    const data = req.body;

    const situationRepository = AppDataSource.getRepository(Situation);
     const situations = await situationRepository.findOneBy({id : Number(id)});

      if(!situations) {
        res.status(404).json({
          message: "Situação não encontrada!",
        });
        return;
      }

     // Atualizar os dados da situação 
     situationRepository.merge(situations, data);

     //salvar as alterações no banco de dados
     const updatedSituation = await situationRepository.save(situations);
     res.status(200).json({
      message: "Situação atualizada com sucesso!",
      situation: updatedSituation,
    });
     
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar situação!",
    });
    return;
  }
});

export default router;
