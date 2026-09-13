import { AgendaService } from '../../src/services/agendaService';
import { Medico } from '../../src/models/medico';
import { AgendaRepository } from '../../src/repositories/agendaRepository';

describe('AgendaService', () => {
  it('should return an empty list when there are no doctors', () => {
  const repository: AgendaRepository = {
    findAll: jest.fn().mockReturnValue([]),
  };

  const service = new AgendaService(repository);

  const result = service.getAgendas();

  expect(result).toEqual([]);
  expect(repository.findAll).toHaveBeenCalledTimes(1);
});

it('should return the doctors exactly as provided by the repository', () => {
  const medicos: Medico[] = [
    {
      id: 10,
      nome: 'Dra. Ana Costa',
      especialidade: 'Pediatra',
      horarios_disponiveis: [
        '2026-06-15 08:00',
        '2026-06-15 09:00',
      ],
    },
  ];

  const repository: AgendaRepository = {
    findAll: jest.fn().mockReturnValue(medicos),
  };

  const service = new AgendaService(repository);

  const result = service.getAgendas();

  expect(result).toEqual(medicos);
  expect(repository.findAll).toHaveBeenCalledTimes(1);
});

  it('should return all available agendas', () => {
    const medicos: Medico[] = [
      {
        id: 1,
        nome: 'Dr. João Silva',
        especialidade: 'Cardiologista',
        horarios_disponiveis: ['2026-06-10 09:00'],
      },
    ];

    const repository: AgendaRepository = {
      findAll: jest.fn().mockReturnValue(medicos),
    };

    const service = new AgendaService(repository);

    const result = service.getAgendas();

    expect(result).toEqual(medicos);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });
});
