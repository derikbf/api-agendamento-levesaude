import { AppError } from './appError';

export class MedicoNaoEncontradoError extends AppError {
  constructor() {
    super('Médico não encontrado.', 400);
  }
}
