import {DataSource} from 'typeorm'
import { Situation } from '../entity/Situations';

export default class CreateSituationSeeds {
  
  public async run(dataSource: DataSource): Promise<void> {
    console.log('Iniciando a criação de seeds para a tabela "situations"...');

    const situationRepository = dataSource.getRepository(Situation);
    const existingCount = await situationRepository.count();

    if (existingCount > 0) {
      console.log('A tabela "situations" já possui registros. Nenhuma seed será criada.');
      return;
    }

    const situationsData = [
      { nameSituation: 'Ativo' },
      { nameSituation: 'Inativo' },
      { nameSituation: 'Pendente' },
    ];

    await situationRepository.save(situationsData);
    console.log('Seeds para a tabela "situations" criadas com sucesso!');
    
  }

}