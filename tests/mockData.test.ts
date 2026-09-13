import { mockMedicos } from '../src/data/mockData';

describe('Mock data', () => {
  it('should contain mocked doctors', () => {
    expect(mockMedicos).toHaveLength(2);
  });

  it('should contain available schedules for doctors', () => {
    expect(mockMedicos[0].horarios_disponiveis).toHaveLength(3);
    expect(mockMedicos[1].horarios_disponiveis).toHaveLength(2);
  });
});
