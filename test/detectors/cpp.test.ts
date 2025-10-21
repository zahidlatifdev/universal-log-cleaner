/**
 * C++ detector tests
 */

import { CppDetector } from '../../src/detectors/cpp';
import { DEFAULT_CONFIG } from '../../src/config';

describe('CppDetector', () => {
  const detector = new CppDetector();

  it('should detect cout statements', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const coutPattern = patterns.find((p) => p.description.includes('cout'));
    expect(coutPattern).toBeDefined();

    const code = `std::cout << "test" << std::endl;`;
    const matches = code.match(coutPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect printf statements', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const printfPattern = patterns.find((p) => p.description.includes('printf'));
    expect(printfPattern).toBeDefined();

    const code = `printf("test %d", value);`;
    const matches = code.match(printfPattern!.pattern);
    expect(matches).toBeTruthy();
  });
});
