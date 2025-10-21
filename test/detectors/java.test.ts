/**
 * Java detector tests
 */

import { JavaDetector } from '../../src/detectors/java';
import { DEFAULT_CONFIG } from '../../src/config';

describe('JavaDetector', () => {
  const detector = new JavaDetector();

  it('should detect System.out.println', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const systemPattern = patterns.find((p) => p.description.includes('System'));
    expect(systemPattern).toBeDefined();

    const code = `System.out.println("test");`;
    const matches = code.match(systemPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect System.err.println', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const systemPattern = patterns.find((p) => p.description.includes('System'));

    const code = `System.err.println("error");`;
    const matches = code.match(systemPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect System.out.print', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const systemPattern = patterns.find((p) => p.description.includes('System'));

    const code = `System.out.print("test");`;
    const matches = code.match(systemPattern!.pattern);
    expect(matches).toBeTruthy();
  });
});
