import { AgendaRepository } from '../../src/repositories/agendaRepository';
import { AgendamentoRepository } from '../../src/repositories/agendamentoRepository';
import { AgendamentoService } from '../../src/services/agendamentoService';

describe('AgendamentoService', () => {
  it('should create an appointment for an available schedule', () => {
    const agendaRepository: AgendaRepository = {
      findAll: jest.fn().mockReturnValue([
        {
          id: 1,
          nome: 'Dr. João Silva',
          especialidade: 'Cardiologista',
          horarios_disponiveis: ['2026-06-10 09:00'],
        },
      ]),
    };

    const agendamentoRepository: AgendamentoRepository = {
      findByMedicoAndHorario: jest.fn().mockReturnValue(undefined),
      create: jest.fn((agendamento) => agendamento),
    };

    const service = new AgendamentoService(
      agendaRepository,
      agendamentoRepository,
    );

    const result = service.createAgendamento({
      medico_id: 1,
      paciente: 'Dérik Barcellos',
      data_horario: '2026-06-10 09:00',
    });

    expect(result).toMatchObject({
      medico_id: 1,
      paciente: 'Dérik Barcellos',
      data_horario: '2026-06-10 09:00',
    });

    expect(result.id).toEqual(expect.any(String));

    expect(agendamentoRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should not create an appointment when the schedule is already occupied', () => {
    const agendaRepository: AgendaRepository = {
      findAll: jest.fn().mockReturnValue([
        {
          id: 1,
          nome: 'Dr. João Silva',
          especialidade: 'Cardiologista',
          horarios_disponiveis: ['2026-06-10 09:00'],
        },
      ]),
    };

    const agendamentoRepository: AgendamentoRepository = {
      findByMedicoAndHorario: jest.fn().mockReturnValue({
        id: 'existing-id',
        medico_id: 1,
        paciente: 'Outro paciente',
        data_horario: '2026-06-10 09:00',
      }),
      create: jest.fn(),
    };

    const service = new AgendamentoService(
      agendaRepository,
      agendamentoRepository,
    );

    expect(() =>
      service.createAgendamento({
        medico_id: 1,
        paciente: 'Dérik Barcellos',
        data_horario: '2026-06-10 09:00',
      }),
    ).toThrow('Horário já está ocupado.');

    expect(agendamentoRepository.create).not.toHaveBeenCalled();
  });

  it('should not create an appointment for an unavailable schedule', () => {
    const agendaRepository: AgendaRepository = {
      findAll: jest.fn().mockReturnValue([
        {
          id: 1,
          nome: 'Dr. João Silva',
          especialidade: 'Cardiologista',
          horarios_disponiveis: ['2026-06-10 09:00'],
        },
      ]),
    };

    const agendamentoRepository: AgendamentoRepository = {
      findByMedicoAndHorario: jest.fn(),
      create: jest.fn(),
    };

    const service = new AgendamentoService(
      agendaRepository,
      agendamentoRepository,
    );

    expect(() =>
      service.createAgendamento({
        medico_id: 1,
        paciente: 'Dérik Barcellos',
        data_horario: '2026-06-10 10:00',
      }),
    ).toThrow('Horário não disponível para este médico.');

    expect(
      agendamentoRepository.findByMedicoAndHorario,
    ).not.toHaveBeenCalled();

    expect(agendamentoRepository.create).not.toHaveBeenCalled();
  });

  it('should not create an appointment for a nonexistent doctor', () => {
    const agendaRepository: AgendaRepository = {
      findAll: jest.fn().mockReturnValue([]),
    };

    const agendamentoRepository: AgendamentoRepository = {
      findByMedicoAndHorario: jest.fn(),
      create: jest.fn(),
    };

    const service = new AgendamentoService(
      agendaRepository,
      agendamentoRepository,
    );

    expect(() =>
      service.createAgendamento({
        medico_id: 999,
        paciente: 'Dérik Barcellos',
        data_horario: '2026-06-10 09:00',
      }),
    ).toThrow('Médico não encontrado.');

    expect(
      agendamentoRepository.findByMedicoAndHorario,
    ).not.toHaveBeenCalled();

    expect(agendamentoRepository.create).not.toHaveBeenCalled();
  });
});
