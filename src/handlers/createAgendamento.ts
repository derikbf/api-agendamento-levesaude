import { APIGatewayProxyHandler } from 'aws-lambda';

import { AppError } from '../errors/appError';
import { InMemoryAgendaRepository } from '../repositories/inMemoryAgendaRepository';
import { InMemoryAgendamentoRepository } from '../repositories/inMemoryAgendamentoRepository';
import { AgendamentoService } from '../services/agendamentoService';
import { validateAgendamentoInput } from '../errors/agendamentoValidator';

const agendaRepository = new InMemoryAgendaRepository();
const agendamentoRepository = new InMemoryAgendamentoRepository();

const agendamentoService = new AgendamentoService(
  agendaRepository,
  agendamentoRepository,
);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const parsedBody: unknown = JSON.parse(event.body ?? '{}');

    const input = validateAgendamentoInput(parsedBody);

    const agendamento = agendamentoService.createAgendamento(input);

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agendamento),
    };
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return {
        statusCode: error.statusCode,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: error.message,
        }),
      };
    }

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Erro interno do servidor.',
      }),
    };
  }
};
