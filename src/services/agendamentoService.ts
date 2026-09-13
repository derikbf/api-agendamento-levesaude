import { randomUUID } from 'crypto';

import { Agendamento } from '../models/agendamento';
import { AgendaRepository } from '../repositories/agendaRepository';
import { AgendamentoRepository } from '../repositories/agendamentoRepository';
import { HorarioIndisponivelError } from '../errors/horarioIndisponivelError';
import { HorarioOcupadoError } from '../errors/horarioOcupadoError';
import { MedicoNaoEncontradoError } from '../errors/medicoNaoEncontradoError';

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
      throw new MedicoNaoEncontradoError();
    }

    const horarioDisponivel = medico.horarios_disponiveis.includes(
      input.data_horario,
    );

    if (!horarioDisponivel) {
      throw new HorarioIndisponivelError();
    }

    const agendamentoExistente =
      this.agendamentoRepository.findByMedicoAndHorario(
        input.medico_id,
        input.data_horario,
      );

    if (agendamentoExistente) {
      throw new HorarioOcupadoError();
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
