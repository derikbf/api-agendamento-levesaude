import { APIGatewayProxyHandler } from 'aws-lambda';

import { AgendaService } from '../services/agendaService';
import { InMemoryAgendaRepository } from '../repositories/inMemoryAgendaRepository';

const agendaRepository = new InMemoryAgendaRepository();
const agendaService = new AgendaService(agendaRepository);

export const handler: APIGatewayProxyHandler = async () => {
  const medicos = agendaService.getAgendas();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      medicos,
    }),
  };
};
