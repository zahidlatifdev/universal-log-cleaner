/**
 * Swift detector tests
 */

import { SwiftDetector } from '../../src/detectors/swift';
import { DEFAULT_CONFIG } from '../../src/config';

describe('SwiftDetector', () => {
  const detector = new SwiftDetector();

  it('should detect print statements', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const printPattern = patterns.find((p) => p.description.includes('print'));
    expect(printPattern).toBeDefined();

    const code = `print("test")`;
    const matches = code.match(printPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect print with multiple arguments', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const printPattern = patterns.find((p) => p.description.includes('print'));

    const code = `print("value:", x)`;
    const matches = code.match(printPattern!.pattern);
    expect(matches).toBeTruthy();
  });
});
