import {DataSource} from 'typeorm'
import { User } from '../entity/Users';
import { Situation } from '../entity/Situations';

export default class CreateUserSeeds {

  public async run(dataSource: DataSource): Promise<void> {
    console.log('Iniciando a criação de seeds para a tabela "users"...');

    const userRepository = dataSource.getRepository(User);
    const existingCount = await userRepository.count();

    if (existingCount > 0) {
      console.log('A tabela "users" já possui registros. Nenhuma seed será criada.');
      return;
    }

    //Buscar as situações já cadastradas para relacionar com os usuários
    const situationRepository = dataSource.getRepository(Situation);
    const ativo = await situationRepository.findOneBy({ nameSituation: 'Ativo' });
    const inativo = await situationRepository.findOneBy({ nameSituation: 'Inativo' });
    const pendente = await situationRepository.findOneBy({ nameSituation: 'Pendente' });

    if (!ativo || !inativo || !pendente) {
      console.log('As situações não foram encontradas. Execute primeiro as seeds de "situations".');
      return;
    }

    const usersData = [
      { name: 'Israel', email: 'israel@email.com', situation: ativo },
      { name: 'Maria', email: 'maria@email.com', situation: ativo },
      { name: 'João', email: 'joao@email.com', situation: inativo },
      { name: 'Ana', email: 'ana@email.com', situation: pendente },
    ];

    await userRepository.save(usersData);
    console.log('Seeds para a tabela "users" criadas com sucesso!');

  }

}
