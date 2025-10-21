/**
 * Go detector tests
 */

import { GoDetector } from '../../src/detectors/go';
import { DEFAULT_CONFIG } from '../../src/config';

describe('GoDetector', () => {
  const detector = new GoDetector();

  it('should detect fmt.Println', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const fmtPattern = patterns.find((p) => p.description.includes('fmt'));
    expect(fmtPattern).toBeDefined();

    const code = `fmt.Println("test")`;
    const matches = code.match(fmtPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect fmt.Printf', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const fmtPattern = patterns.find((p) => p.description.includes('fmt'));

    const code = `fmt.Printf("value: %d", x)`;
    const matches = code.match(fmtPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect fmt.Print', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const fmtPattern = patterns.find((p) => p.description.includes('fmt'));

    const code = `fmt.Print("test")`;
    const matches = code.match(fmtPattern!.pattern);
    expect(matches).toBeTruthy();
  });
});
