/**
 * C# detector tests
 */

import { CSharpDetector } from '../../src/detectors/csharp';
import { DEFAULT_CONFIG } from '../../src/config';

describe('CSharpDetector', () => {
  const detector = new CSharpDetector();

  it('should detect Console.WriteLine', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const consolePattern = patterns.find((p) => p.description.includes('Console'));
    expect(consolePattern).toBeDefined();

    const code = `Console.WriteLine("test");`;
    const matches = code.match(consolePattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect Console.Write', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const consolePattern = patterns.find((p) => p.description.includes('Console'));

    const code = `Console.Write("test");`;
    const matches = code.match(consolePattern!.pattern);
    expect(matches).toBeTruthy();
  });
});
