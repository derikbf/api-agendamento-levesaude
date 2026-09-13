import { InMemoryAgendaRepository } from '../../src/repositories/inMemoryAgendaRepository';

describe('InMemoryAgendaRepository', () => {
  it('should return all mocked doctors', () => {
    const repository = new InMemoryAgendaRepository();

    const medicos = repository.findAll();

    expect(medicos).toHaveLength(2);
    expect(medicos[0].nome).toBe('Dr. João Silva');
    expect(medicos[1].nome).toBe('Dra. Maria Souza');
  });
});
