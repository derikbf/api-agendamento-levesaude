import { APIGatewayProxyResult } from 'aws-lambda';

import { handler } from '../../src/handlers/createAgendamento';

describe('POST /agendamento handler', () => {
  it('should create an appointment and return 201', async () => {
    const response = (await handler(
      {
        body: JSON.stringify({
          medico_id: 1,
          paciente: 'Dérik Barcellos',
          data_horario: '2026-06-10 09:00',
        }),
      } as never,
      {} as never,
      () => undefined,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(201);

    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });

    expect(JSON.parse(response.body)).toMatchObject({
      medico_id: 1,
      paciente: 'Dérik Barcellos',
      data_horario: '2026-06-10 09:00',
    });
  });
});
