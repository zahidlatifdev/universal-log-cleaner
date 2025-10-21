/**
 * Selective log types configuration tests
 */

import { JavaScriptDetector } from '../../src/detectors/javascript';
import { TypeScriptDetector } from '../../src/detectors/typescript';
import { DEFAULT_CONFIG } from '../../src/config';
import { CleanerConfig } from '../../src/types';

describe('Selective Log Types', () => {
  describe('JavaScript selective console methods', () => {
    const detector = new JavaScriptDetector();

    it('should only detect console.log when log is enabled', () => {
      const config: CleanerConfig = {
        ...DEFAULT_CONFIG,
        logTypes: {
          javascript: {
            log: true,
            debug: false,
            info: false,
            warn: false,
            error: false,
            trace: false,
            table: false,
            dir: false,
            assert: false,
            count: false,
            group: false,
            time: false,
          },
          debugger: false,
          allOtherLogs: true,
        },
      };

      const patterns = detector.buildPatterns(config);
      const consolePattern = patterns.find((p) => p.description.includes('console'));
      expect(consolePattern).toBeDefined();

      // Should match console.log
      expect('console.log("test");').toMatch(consolePattern!.pattern);

      // Should not match other methods
      expect('console.debug("test");').not.toMatch(consolePattern!.pattern);
      expect('console.warn("test");').not.toMatch(consolePattern!.pattern);
    });

    it('should detect console.warn and console.error only', () => {
      const config: CleanerConfig = {
        ...DEFAULT_CONFIG,
        logTypes: {
          javascript: {
            log: false,
            debug: false,
            info: false,
            warn: true,
            error: true,
            trace: false,
            table: false,
            dir: false,
            assert: false,
            count: false,
            group: false,
            time: false,
          },
          debugger: false,
          allOtherLogs: true,
        },
      };

      const patterns = detector.buildPatterns(config);
      const consolePattern = patterns.find((p) => p.description.includes('console'));
      expect(consolePattern).toBeDefined();

      // Should match warn and error
      expect('console.warn("test");').toMatch(consolePattern!.pattern);
      expect('console.error("test");').toMatch(consolePattern!.pattern);

      // Should not match log
      expect('console.log("test");').not.toMatch(consolePattern!.pattern);
    });

    it('should not generate console patterns when all disabled', () => {
      const config: CleanerConfig = {
        ...DEFAULT_CONFIG,
        logTypes: {
          javascript: {
            log: false,
            debug: false,
            info: false,
            warn: false,
            error: false,
            trace: false,
            table: false,
            dir: false,
            assert: false,
            count: false,
            group: false,
            time: false,
          },
          debugger: false,
          allOtherLogs: true,
        },
      };

      const patterns = detector.buildPatterns(config);
      const consolePattern = patterns.find((p) => p.description.includes('console'));
      expect(consolePattern).toBeUndefined();
    });

    it('should detect debugger only when enabled', () => {
      const config: CleanerConfig = {
        ...DEFAULT_CONFIG,
        logTypes: {
          javascript: {
            log: false,
            debug: false,
            info: false,
            warn: false,
            error: false,
            trace: false,
            table: false,
            dir: false,
            assert: false,
            count: false,
            group: false,
            time: false,
          },
          debugger: true,
          allOtherLogs: true,
        },
      };

      const patterns = detector.buildPatterns(config);
      const debuggerPattern = patterns.find((p) => p.description.includes('Debugger'));
      expect(debuggerPattern).toBeDefined();
      expect('debugger;').toMatch(debuggerPattern!.pattern);
    });

    it('should detect all console.table variations', () => {
      const config: CleanerConfig = {
        ...DEFAULT_CONFIG,
        logTypes: {
          javascript: {
            log: false,
            debug: false,
            info: false,
            warn: false,
            error: false,
            trace: false,
            table: true,
            dir: false,
            assert: false,
            count: false,
            group: false,
            time: false,
          },
          debugger: false,
          allOtherLogs: true,
        },
      };

      const patterns = detector.buildPatterns(config);
      const consolePattern = patterns.find((p) => p.description.includes('console'));
      expect(consolePattern).toBeDefined();

      expect('console.table(data);').toMatch(consolePattern!.pattern);
    });
  });

  describe('TypeScript selective console methods', () => {
    const detector = new TypeScriptDetector();

    it('should respect the same log type configuration as JavaScript', () => {
      const config: CleanerConfig = {
        ...DEFAULT_CONFIG,
        logTypes: {
          javascript: {
            log: true,
            debug: false,
            info: false,
            warn: false,
            error: false,
            trace: false,
            table: false,
            dir: false,
            assert: false,
            count: false,
            group: false,
            time: false,
          },
          debugger: false,
          allOtherLogs: true,
        },
      };

      const patterns = detector.buildPatterns(config);
      const consolePattern = patterns.find((p) => p.description.includes('console'));
      expect(consolePattern).toBeDefined();

      expect('console.log("test");').toMatch(consolePattern!.pattern);
      expect('console.debug("test");').not.toMatch(consolePattern!.pattern);
    });
  });
});
