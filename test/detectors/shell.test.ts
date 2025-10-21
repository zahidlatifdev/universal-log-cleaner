/**
 * Shell detector tests
 */

import { ShellDetector } from '../../src/detectors/shell';
import { DEFAULT_CONFIG } from '../../src/config';

describe('ShellDetector', () => {
  const detector = new ShellDetector();

  it('should detect echo statements', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const echoPattern = patterns.find((p) => p.description.includes('echo'));
    expect(echoPattern).toBeDefined();

    const code = `echo "test"`;
    const matches = code.match(echoPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect echo with variables', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const echoPattern = patterns.find((p) => p.description.includes('echo'));

    const code = `echo "value: $VAR"`;
    const matches = code.match(echoPattern!.pattern);
    expect(matches).toBeTruthy();
  });
});
