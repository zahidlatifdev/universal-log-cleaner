/**
 * PHP detector tests
 */

import { PHPDetector } from '../../src/detectors/php';
import { DEFAULT_CONFIG } from '../../src/config';

describe('PHPDetector', () => {
  const detector = new PHPDetector();

  it('should detect echo', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const echoPattern = patterns.find((p) => p.description.includes('echo'));
    expect(echoPattern).toBeDefined();

    const code = `echo "test";`;
    const matches = code.match(echoPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect print', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const echoPattern = patterns.find((p) => p.description.includes('echo'));

    const code = `print "test";`;
    const matches = code.match(echoPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect var_dump', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const echoPattern = patterns.find((p) => p.description.includes('echo'));

    const code = `var_dump($variable);`;
    const matches = code.match(echoPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect print_r', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const echoPattern = patterns.find((p) => p.description.includes('echo'));

    const code = `print_r($array);`;
    const matches = code.match(echoPattern!.pattern);
    expect(matches).toBeTruthy();
  });
});
