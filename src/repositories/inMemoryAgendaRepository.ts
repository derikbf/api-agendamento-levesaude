import { mockMedicos } from '../data/mockData';
import { Medico } from '../models/medico';
import { AgendaRepository } from './agendaRepository';

export class InMemoryAgendaRepository implements AgendaRepository {
  findAll(): Medico[] {
    return mockMedicos;
  }
}
