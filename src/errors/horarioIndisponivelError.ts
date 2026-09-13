import { AppError } from './appError';

export class HorarioIndisponivelError extends AppError {
  constructor() {
    super('Horário não disponível para este médico.', 400);
  }
}
