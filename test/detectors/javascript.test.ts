/**
 * JavaScript detector tests
 */

import { JavaScriptDetector } from '../../src/detectors/javascript';
import { DEFAULT_CONFIG } from '../../src/config';

describe('JavaScriptDetector', () => {
  const detector = new JavaScriptDetector();

  it('should detect console.log', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const consolePattern = patterns.find((p) => p.description.includes('console'));
    expect(consolePattern).toBeDefined();

    const code = `console.log('test');`;
    const matches = code.match(consolePattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect multiple console methods', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const consolePattern = patterns.find((p) => p.description.includes('console'));

    const methods = ['log', 'debug', 'info', 'warn', 'error', 'trace'];
    for (const method of methods) {
      const code = `console.${method}('test');`;
      const matches = code.match(consolePattern!.pattern);
      expect(matches).toBeTruthy();
    }
  });

  it('should detect debugger statements', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const debuggerPattern = patterns.find((p) => p.description.includes('Debugger'));
    expect(debuggerPattern).toBeDefined();

    const code = `debugger;`;
    const matches = code.match(debuggerPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should detect commented console.log when enabled', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const commentPattern = patterns.find((p) => p.description.includes('commented'));
    expect(commentPattern).toBeDefined();

    const code = `// console.log('test');`;
    const matches = code.match(commentPattern!.pattern);
    expect(matches).toBeTruthy();
  });

  it('should handle multi-line console statements', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const consolePattern = patterns.find((p) => p.description.includes('console'));

    const code = `console.log(
      'test',
      'multi-line'
    );`;
    const matches = code.match(consolePattern!.pattern);
    expect(matches).toBeTruthy();
  });
});
