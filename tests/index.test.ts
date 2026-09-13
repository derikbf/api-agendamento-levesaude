import { appName } from '../src';

describe('Application', () => {
  it('should have an application name', () => {
    expect(appName).toBe('api-agendamento-levesaude');
  });
});
