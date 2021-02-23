import { ElapsedTimePipe } from './elapsed-time.pipe';

describe('ElapsedTimePipe', () => {
  it('create an instance', () => {
    const pipe: ElapsedTimePipe = new ElapsedTimePipe();
    expect(pipe).toBeTruthy();
  });
});
