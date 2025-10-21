/**
 * Regex builder tests
 */

import {
  buildJSConsolePattern,
  buildPythonPrintPattern,
  buildJavaSystemOutPattern,
  buildGoFmtPattern,
  buildRustPrintPattern,
  buildCommentedLogPattern,
  escapeRegex,
} from '../src/regexBuilder';

describe('RegexBuilder', () => {
  describe('buildJSConsolePattern', () => {
    const pattern = buildJSConsolePattern();

    it('should match console.log', () => {
      expect('console.log("test");').toMatch(pattern);
    });

    it('should match console.error', () => {
      expect('console.error("test");').toMatch(pattern);
    });

    it('should match console.warn', () => {
      expect('console.warn("test");').toMatch(pattern);
    });
  });

  describe('buildPythonPrintPattern', () => {
    const pattern = buildPythonPrintPattern();

    it('should match print', () => {
      expect('print("test")').toMatch(pattern);
    });

    it('should match print with multiple args', () => {
      expect('print("test", x, y)').toMatch(pattern);
    });
  });

  describe('buildJavaSystemOutPattern', () => {
    const pattern = buildJavaSystemOutPattern();

    it('should match System.out.println', () => {
      expect('System.out.println("test");').toMatch(pattern);
    });

    it('should match System.err.println', () => {
      expect('System.err.println("error");').toMatch(pattern);
    });
  });

  describe('buildGoFmtPattern', () => {
    const pattern = buildGoFmtPattern();

    it('should match fmt.Println', () => {
      expect('fmt.Println("test")').toMatch(pattern);
    });

    it('should match fmt.Printf', () => {
      expect('fmt.Printf("test: %s", value)').toMatch(pattern);
    });
  });

  describe('buildRustPrintPattern', () => {
    const pattern = buildRustPrintPattern();

    it('should match println!', () => {
      expect('println!("test")').toMatch(pattern);
    });

    it('should match dbg!', () => {
      expect('dbg!(variable)').toMatch(pattern);
    });
  });

  describe('buildCommentedLogPattern', () => {
    it('should match commented console.log', () => {
      const pattern = buildCommentedLogPattern('//');
      expect('// console.log("test")').toMatch(pattern);
    });

    it('should match commented print', () => {
      const pattern = buildCommentedLogPattern('#');
      expect('# print("test")').toMatch(pattern);
    });
  });

  describe('escapeRegex', () => {
    it('should escape special characters', () => {
      expect(escapeRegex('test.log')).toBe('test\\.log');
      expect(escapeRegex('test[0]')).toBe('test\\[0\\]');
      expect(escapeRegex('test*')).toBe('test\\*');
    });
  });
});
