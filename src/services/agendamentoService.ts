import { randomUUID } from 'crypto';

import { Agendamento } from '../models/agendamento';
import { AgendaRepository } from '../repositories/agendaRepository';
import { AgendamentoRepository } from '../repositories/agendamentoRepository';

export interface CreateAgendamentoInput {
  medico_id: number;
  paciente: string;
  data_horario: string;
}

export class AgendamentoService {
  constructor(
    private readonly agendaRepository: AgendaRepository,
    private readonly agendamentoRepository: AgendamentoRepository,
  ) {}

  createAgendamento(input: CreateAgendamentoInput): Agendamento {
    const medicos = this.agendaRepository.findAll();

    const medico = medicos.find(
      (medico) => medico.id === input.medico_id,
    );

    if (!medico) {
      throw new Error('Médico não encontrado.');
    }

    const horarioDisponivel = medico.horarios_disponiveis.includes(
      input.data_horario,
    );

    if (!horarioDisponivel) {
      throw new Error('Horário não disponível para este médico.');
    }

    const agendamentoExistente =
      this.agendamentoRepository.findByMedicoAndHorario(
        input.medico_id,
        input.data_horario,
      );

    if (agendamentoExistente) {
      throw new Error('Horário já está ocupado.');
    }

    const agendamento: Agendamento = {
      id: randomUUID(),
      medico_id: input.medico_id,
      paciente: input.paciente,
      data_horario: input.data_horario,
    };

    return this.agendamentoRepository.create(agendamento);
  }
}
