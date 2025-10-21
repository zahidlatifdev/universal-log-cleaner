/**
 * Ruby detector tests
 */

import { RubyDetector } from '../../src/detectors/ruby';
import { DEFAULT_CONFIG } from '../../src/config';

describe('RubyDetector', () => {
  const detector = new RubyDetector();

  it('should detect puts', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const putsPattern = patterns.find((p) => p.description.includes('puts'));
    expect(putsPattern).toBeDefined();

    const code = `puts "test"`;
    const matches = code.match(putsPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect print', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const putsPattern = patterns.find((p) => p.description.includes('puts'));

    const code = `print "test"`;
    const matches = code.match(putsPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect p', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const putsPattern = patterns.find((p) => p.description.includes('puts'));

    const code = `p variable`;
    const matches = code.match(putsPattern!.pattern);
    expect(matches).toBeTruthy();
  });
});
