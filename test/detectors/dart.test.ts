/**
 * Dart detector tests
 */

import { DartDetector } from '../../src/detectors/dart';
import { DEFAULT_CONFIG } from '../../src/config';

describe('DartDetector', () => {
  const detector = new DartDetector();

  it('should detect print statements', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const printPattern = patterns.find((p) => p.description.includes('print'));
    expect(printPattern).toBeDefined();

    const code = `print('test');`;
    const matches = code.match(printPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect print with variables', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const printPattern = patterns.find((p) => p.description.includes('print'));

    const code = `print('value: $value');`;
    const matches = code.match(printPattern!.pattern);
    expect(matches).toBeTruthy();
  });
});
