import { ValidationError } from '../errors/validationError';
import { CreateAgendamentoInput } from '../services/agendamentoService';

export function validateAgendamentoInput(
  input: unknown,
): CreateAgendamentoInput {
  if (typeof input !== 'object' || input === null) {
    throw new ValidationError('Payload inválido.');
  }

  const payload = input as Record<string, unknown>;

  if (
    typeof payload.medico_id !== 'number' ||
    !Number.isInteger(payload.medico_id)
  ) {
    throw new ValidationError('medico_id deve ser um número inteiro.');
  }

  if (
    typeof payload.paciente !== 'string' ||
    payload.paciente.trim().length === 0
  ) {
    throw new ValidationError('paciente é obrigatório.');
  }

  if (
    typeof payload.data_horario !== 'string' ||
    payload.data_horario.trim().length === 0
  ) {
    throw new ValidationError('data_horario é obrigatório.');
  }

  return {
    medico_id: payload.medico_id,
    paciente: payload.paciente,
    data_horario: payload.data_horario,
  };
}
