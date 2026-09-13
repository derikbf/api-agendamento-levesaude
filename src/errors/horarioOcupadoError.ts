import { AppError } from './appError';

export class HorarioOcupadoError extends AppError {
  constructor() {
    super('Horário já está ocupado.', 409);
  }
}
