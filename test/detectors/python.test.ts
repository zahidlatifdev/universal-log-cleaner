/**
 * Python detector tests
 */

import { PythonDetector } from '../../src/detectors/python';
import { DEFAULT_CONFIG } from '../../src/config';

describe('PythonDetector', () => {
  const detector = new PythonDetector();

  it('should detect print statements', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const printPattern = patterns.find((p) => p.description.includes('print'));
    expect(printPattern).toBeDefined();

    const code = `print('test')`;
    const matches = code.match(printPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect f-strings in print', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const printPattern = patterns.find((p) => p.description.includes('print'));

    const code = `print(f'value: {x}')`;
    const matches = code.match(printPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect commented print when enabled', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const commentPattern = patterns.find((p) => p.description.includes('Commented'));
    expect(commentPattern).toBeDefined();

    const code = `# print('test')`;
    const matches = code.match(commentPattern!.pattern);
    expect(matches).toBeTruthy();
  });
});
