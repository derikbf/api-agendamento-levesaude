import { APIGatewayProxyHandler } from 'aws-lambda';

import { InMemoryAgendaRepository } from '../repositories/inMemoryAgendaRepository';
import { InMemoryAgendamentoRepository } from '../repositories/inMemoryAgendamentoRepository';
import {
  AgendamentoService,
  CreateAgendamentoInput,
} from '../services/agendamentoService';

const agendaRepository = new InMemoryAgendaRepository();
const agendamentoRepository = new InMemoryAgendamentoRepository();

const agendamentoService = new AgendamentoService(
  agendaRepository,
  agendamentoRepository,
);

export const handler: APIGatewayProxyHandler = async (event) => {
  const input = JSON.parse(event.body ?? '{}') as CreateAgendamentoInput;

  const agendamento = agendamentoService.createAgendamento(input);

  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agendamento),
  };
};
