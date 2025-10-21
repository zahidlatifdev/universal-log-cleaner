/**
 * Rust detector tests
 */

import { RustDetector } from '../../src/detectors/rust';
import { DEFAULT_CONFIG } from '../../src/config';

describe('RustDetector', () => {
  const detector = new RustDetector();

  it('should detect println! macro', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const printPattern = patterns.find((p) => p.description.includes('println'));
    expect(printPattern).toBeDefined();

    const code = `println!("test")`;
    const matches = code.match(printPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect print! macro', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const printPattern = patterns.find((p) => p.description.includes('println'));

    const code = `print!("test")`;
    const matches = code.match(printPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect dbg! macro', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const printPattern = patterns.find((p) => p.description.includes('println'));

    const code = `dbg!(variable)`;
    const matches = code.match(printPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect eprintln! macro', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const printPattern = patterns.find((p) => p.description.includes('println'));

    const code = `eprintln!("error")`;
    const matches = code.match(printPattern!.pattern);
    expect(matches).toBeTruthy();
  });
});
