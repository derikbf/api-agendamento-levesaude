import { Medico } from '../models/medico';
import { AgendaRepository } from '../repositories/agendaRepository';

export class AgendaService {
  constructor(private readonly agendaRepository: AgendaRepository) {}

  getAgendas(): Medico[] {
    return this.agendaRepository.findAll();
  }
}
