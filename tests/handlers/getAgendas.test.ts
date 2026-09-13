import { APIGatewayProxyResult } from 'aws-lambda';

import { handler } from '../../src/handlers/getAgendas';

describe('GET /agendas handler', () => {
  it('should return the available doctors and schedules', async () => {
    const response = (await handler(
      {} as never,
      {} as never,
      () => undefined,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });

    expect(JSON.parse(response.body)).toEqual({
      medicos: [
        {
          id: 1,
          nome: 'Dr. João Silva',
          especialidade: 'Cardiologista',
          horarios_disponiveis: [
            '2026-06-10 09:00',
            '2026-06-10 10:00',
            '2026-06-10 11:00',
          ],
        },
        {
          id: 2,
          nome: 'Dra. Maria Souza',
          especialidade: 'Dermatologista',
          horarios_disponiveis: ['2026-06-11 14:00', '2026-06-11 15:00'],
        },
      ],
    });
  });
});
