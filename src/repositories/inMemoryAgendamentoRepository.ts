import { Agendamento } from '../models/agendamento';
import { AgendamentoRepository } from './agendamentoRepository';

export class InMemoryAgendamentoRepository
  implements AgendamentoRepository
{
  private readonly agendamentos: Agendamento[] = [];

  findByMedicoAndHorario(
    medicoId: number,
    dataHorario: string,
  ): Agendamento | undefined {
    return this.agendamentos.find(
      (agendamento) =>
        agendamento.medico_id === medicoId &&
        agendamento.data_horario === dataHorario,
    );
  }

  create(agendamento: Agendamento): Agendamento {
    this.agendamentos.push(agendamento);

    return agendamento;
  }
}
