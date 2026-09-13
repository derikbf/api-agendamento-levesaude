import { Agendamento } from '../models/agendamento';

export interface AgendamentoRepository {
  findByMedicoAndHorario(
    medicoId: number,
    dataHorario: string,
  ): Agendamento | undefined;

  create(agendamento: Agendamento): Agendamento;
}
