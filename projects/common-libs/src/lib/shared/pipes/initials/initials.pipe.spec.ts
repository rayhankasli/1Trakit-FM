import { InitialsPipe } from './initials.pipe';

describe('InitialsPipe', () => {
  const pipe = new InitialsPipe();

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return - if no values provided', () => {
    expect(pipe.transform(null)).toBe('-');
  });

  it('should return first 2 letters if no space separator found', () => {
    const str = 'testString';

    expect(pipe.transform(str)).toBe('TE');
  });

  it('should return first 2 letters if no . separator found', () => {
    const str = 'testString';

    expect(pipe.transform(str)).toBe('TE');
  });

  it('should return first and only letter if a single letter provided', () => {
    const str = 'a';

    expect(pipe.transform(str)).toBe('A');
  });

  it('should alwase return an Uppercase string', () => {
    const str1 = 'a';
    const str2 = 'abc test';
    expect(pipe.transform(str1)).toBe(str1.toUpperCase());
    expect(pipe.transform(str2)).toBe('at'.toUpperCase());
  });

  it('should return given number of initial letters from stirng in upper case', () => {
    const str = 'test string data';

    expect(pipe.transform(str, 2)).toBe('TS');
    expect(pipe.transform(str, 3)).toBe('TSD');
  });
});
