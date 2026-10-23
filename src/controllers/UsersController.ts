import express, {Request, Response} from 'express';
import { User } from '../entity/Users';
import { Situation } from '../entity/Situations';
import { AppDataSource } from '../data-source';
import { PaginationService } from '../services/paginationService';

const router = express.Router();

//Criar a lista
router.get("/users", async(req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    //Receber o número de página
    const page = Number(req.query.page) || 1;

    //Definir o número de itens por página
    const limit = Number(req.query.limit) || 10;

    //Resultado da paginação, trazendo a situação de cada usuário
    const result = await PaginationService.paginate(userRepository, page, limit, {id: "ASC"}, {situation: true});

    //Retornar a resposta com os usuários e informações de paginação
    res.status(200).json(result);
    return;

  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar usuários!",
    });
    return;
  }
});

// Criar visualização de usuários
router.get("/users/:id", async(req: Request, res: Response) => {
  try {

    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {id : Number(id)},
      relations: {situation: true}
    });

    if(!user) {
      res.status(404).json({
        message: "Usuário não encontrado!",
      });
      return;
    }

    res.status(200).json(user);
    return;

  } catch (error) {
    res.status(500).json({
      message: "Erro ao visualizar usuário!",
    });
    return;
  }
});

// Criar usuário
router.post("/users", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    //Verificar se a situação informada existe
    const situationRepository = AppDataSource.getRepository(Situation);
    const situation = await situationRepository.findOneBy({id: Number(data.situationId)});

    if(!situation) {
      res.status(404).json({
        message: "Situação não encontrada!",
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create({
      name: data.name,
      email: data.email,
      situation: situation,
    });
    await userRepository.save(user);

    res.status(201).json({
      message: "Usuário criado com sucesso!",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erro ao criar usuário!",
    });
  }
});

// Atualizar usuário
router.put("/users/:id", async(req: Request, res: Response) => {
  try {

    const { id } = req.params;
    const data = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {id : Number(id)},
      relations: {situation: true}
    });

    if(!user) {
      res.status(404).json({
        message: "Usuário não encontrado!",
      });
      return;
    }

    //Se foi enviada uma nova situação, verificar se ela existe
    if(data.situationId !== undefined) {
      const situationRepository = AppDataSource.getRepository(Situation);
      const situation = await situationRepository.findOneBy({id: Number(data.situationId)});

      if(!situation) {
        res.status(404).json({
          message: "Situação não encontrada!",
        });
        return;
      }
      user.situation = situation;
    }

    // Atualizar os dados do usuário
    userRepository.merge(user, { name: data.name, email: data.email });

    //salvar as alterações no banco de dados
    const updatedUser = await userRepository.save(user);
    res.status(200).json({
      message: "Usuário atualizado com sucesso!",
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar usuário!",
    });
    return;
  }
});

// Deletar usuário
router.delete("/users/:id", async(req: Request, res: Response) => {
  try {

    const { id } = req.params;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({id : Number(id)});

    if(!user) {
      res.status(404).json({
        message: "Usuário não encontrado!",
      });
      return;
    }

    // Remover os dados do usuário
    await userRepository.remove(user);

    res.status(200).json({
      message: "Usuário removido com sucesso!",
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao remover usuário!",
    });
    return;
  }
});

export default router;
