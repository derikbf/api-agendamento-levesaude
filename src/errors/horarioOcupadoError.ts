import { AppError } from './appError';

export class HorarioOcupadoError extends AppError {
  constructor() {
    super(
      'O horário solicitado não está mais disponível para este médico.',
      409,
    );
  }
}
