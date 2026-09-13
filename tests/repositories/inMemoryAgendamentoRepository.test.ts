import { InMemoryAgendamentoRepository } from '../../src/repositories/inMemoryAgendamentoRepository';

describe('InMemoryAgendamentoRepository', () => {
  it('should create and find an appointment by doctor and schedule', () => {
    const repository = new InMemoryAgendamentoRepository();

    const agendamento = {
      id: '1',
      medico_id: 1,
      paciente: 'Dérik Barcellos',
      data_horario: '2026-06-10 09:00',
    };

    repository.create(agendamento);

    const result = repository.findByMedicoAndHorario(
      1,
      '2026-06-10 09:00',
    );

    expect(result).toEqual(agendamento);
  });

  it('should return undefined when the schedule is not occupied', () => {
    const repository = new InMemoryAgendamentoRepository();

    const result = repository.findByMedicoAndHorario(
      1,
      '2026-06-10 09:00',
    );

    expect(result).toBeUndefined();
  });
});
