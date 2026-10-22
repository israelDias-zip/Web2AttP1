import express, {Request, Response} from 'express';
import { Situation } from '../entity/Situations';
import { AppDataSource } from '../data-source';

const router = express.Router();

router.get("/situations", (req: Request, res: Response) => {
  res.send("Hello World! Welcome thats the situations page");
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

export default router;
