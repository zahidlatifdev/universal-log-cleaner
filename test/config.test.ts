/**
 * Configuration tests
 */

import { DEFAULT_CONFIG, validateConfig } from '../src/config';
import { CleanerConfig } from '../src/types';

describe('Configuration', () => {
  describe('DEFAULT_CONFIG', () => {
    it('should have valid default values', () => {
      expect(DEFAULT_CONFIG.languages.length).toBeGreaterThan(0);
      expect(DEFAULT_CONFIG.mode).toBe('preview');
      expect(DEFAULT_CONFIG.maxFileSizeKB).toBeGreaterThan(0);
      expect(DEFAULT_CONFIG.dryRunDefault).toBe(true);
    });
  });

  describe('validateConfig', () => {
    it('should validate correct config', () => {
      const errors = validateConfig(DEFAULT_CONFIG);
      expect(errors).toEqual([]);
    });

    it('should detect invalid maxFileSizeKB', () => {
      const config: CleanerConfig = {
        ...DEFAULT_CONFIG,
        maxFileSizeKB: -1,
      };
      const errors = validateConfig(config);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('maxFileSizeKB');
    });

    it('should detect empty languages array', () => {
      const config: CleanerConfig = {
        ...DEFAULT_CONFIG,
        languages: [],
      };
      const errors = validateConfig(config);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('language');
    });

    it('should detect invalid mode', () => {
      const config: CleanerConfig = {
        ...DEFAULT_CONFIG,
        mode: 'invalid' as any,
      };
      const errors = validateConfig(config);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('mode');
    });
  });
});
