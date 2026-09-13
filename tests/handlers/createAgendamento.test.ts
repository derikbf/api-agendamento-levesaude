import { APIGatewayProxyResult } from 'aws-lambda';

import { handler } from '../../src/handlers/createAgendamento';

describe('POST /agendamento handler', () => {
  it('should create an appointment and return 201', async () => {
    const response = (await handler(
      {
        body: JSON.stringify({
          agendamento: {
            medico_id: 1,
            paciente: 'Dérik Barcellos',
            data_horario: '2026-06-10 09:00',
          },
        }),
      } as never,
      {} as never,
      () => undefined,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(201);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });

    const body = JSON.parse(response.body);

    expect(body.mensagem).toBe(
      'Agendamento realizado com sucesso',
    );

    expect(body.agendamento).toMatchObject({
      medico: 'Dr. João Silva',
      paciente: 'Dérik Barcellos',
      data_horario: '2026-06-10 09:00',
    });

    expect(body.agendamento.id).toEqual(expect.any(String));
  });

  it('should return 409 when the schedule is already occupied', async () => {
    const firstResponse = (await handler(
      {
        body: JSON.stringify({
          agendamento: {
            medico_id: 1,
            paciente: 'Paciente 1',
            data_horario: '2026-06-10 10:00',
          },
        }),
      } as never,
      {} as never,
      () => undefined,
    )) as APIGatewayProxyResult;

    expect(firstResponse.statusCode).toBe(201);

    const secondResponse = (await handler(
      {
        body: JSON.stringify({
          agendamento: {
            medico_id: 1,
            paciente: 'Paciente 2',
            data_horario: '2026-06-10 10:00',
          },
        }),
      } as never,
      {} as never,
      () => undefined,
    )) as APIGatewayProxyResult;

    expect(secondResponse.statusCode).toBe(409);

    expect(JSON.parse(secondResponse.body)).toEqual({
      erro: 'Horário indisponível',
      mensagem:
        'O horário solicitado não está mais disponível para este médico.',
    });
  });

  it('should return 400 when medico_id is missing', async () => {
    const response = (await handler(
      {
        body: JSON.stringify({
          agendamento: {
            paciente: 'Dérik Barcellos',
            data_horario: '2026-06-10 11:00',
          },
        }),
      } as never,
      {} as never,
      () => undefined,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);

    expect(JSON.parse(response.body)).toEqual({
      error: 'medico_id deve ser um número inteiro.',
    });
  });

  it('should return 400 when paciente is empty', async () => {
    const response = (await handler(
      {
        body: JSON.stringify({
          agendamento: {
            medico_id: 1,
            paciente: '',
            data_horario: '2026-06-10 11:00',
          },
        }),
      } as never,
      {} as never,
      () => undefined,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);

    expect(JSON.parse(response.body)).toEqual({
      error: 'paciente é obrigatório.',
    });
  });

  it('should return 400 when data_horario is missing', async () => {
    const response = (await handler(
      {
        body: JSON.stringify({
          agendamento: {
            medico_id: 1,
            paciente: 'Dérik Barcellos',
          },
        }),
      } as never,
      {} as never,
      () => undefined,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);

    expect(JSON.parse(response.body)).toEqual({
      error: 'data_horario é obrigatório.',
    });
  });

  it('should return 400 when the doctor does not exist', async () => {
    const response = (await handler(
      {
        body: JSON.stringify({
          agendamento: {
            medico_id: 999,
            paciente: 'Dérik Barcellos',
            data_horario: '2026-06-10 11:00',
          },
        }),
      } as never,
      {} as never,
      () => undefined,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);

    expect(JSON.parse(response.body)).toEqual({
      error: 'Médico não encontrado.',
    });
  });

  it('should return 400 when the schedule is unavailable', async () => {
    const response = (await handler(
      {
        body: JSON.stringify({
          agendamento: {
            medico_id: 1,
            paciente: 'Dérik Barcellos',
            data_horario: '2026-06-10 18:00',
          },
        }),
      } as never,
      {} as never,
      () => undefined,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);

    expect(JSON.parse(response.body)).toEqual({
      error: 'Horário não disponível para este médico.',
    });
  });

  it('should return 400 when the request body is not valid JSON', async () => {
    const response = (await handler(
      {
        body: '{invalid-json',
      } as never,
      {} as never,
      () => undefined,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);

    expect(JSON.parse(response.body)).toEqual({
      error: 'Payload deve ser um JSON válido.',
    });
  });
});
