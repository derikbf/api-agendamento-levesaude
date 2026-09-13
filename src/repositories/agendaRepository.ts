import { Medico } from '../models/medico';

export interface AgendaRepository {
  findAll(): Medico[];
}
