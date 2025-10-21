/**
 * File utils tests
 */

import { shouldExcludeFile, getLanguageIdFromPath } from '../../src/utils/fileUtils';

describe('FileUtils', () => {
  describe('shouldExcludeFile', () => {
    const excludePatterns = ['**/node_modules/**', '**/dist/**', '**/*.min.js'];

    it('should exclude node_modules', () => {
      const result = shouldExcludeFile('/project/node_modules/package/file.js', excludePatterns);
      expect(result).toBe(true);
    });

    it('should exclude dist folder', () => {
      const result = shouldExcludeFile('/project/dist/bundle.js', excludePatterns);
      expect(result).toBe(true);
    });

    it('should exclude minified files', () => {
      const result = shouldExcludeFile('/project/src/app.min.js', excludePatterns);
      expect(result).toBe(true);
    });

    it('should not exclude normal files', () => {
      const result = shouldExcludeFile('/project/src/app.js', excludePatterns);
      expect(result).toBe(false);
    });
  });

  describe('getLanguageIdFromPath', () => {
    it('should detect JavaScript', () => {
      expect(getLanguageIdFromPath('file.js')).toBe('javascript');
      expect(getLanguageIdFromPath('file.mjs')).toBe('javascript');
    });

    it('should detect TypeScript', () => {
      expect(getLanguageIdFromPath('file.ts')).toBe('typescript');
      expect(getLanguageIdFromPath('file.tsx')).toBe('typescriptreact');
    });

    it('should detect Python', () => {
      expect(getLanguageIdFromPath('file.py')).toBe('python');
    });

    it('should detect Java', () => {
      expect(getLanguageIdFromPath('File.java')).toBe('java');
    });

    it('should return undefined for unknown extension', () => {
      expect(getLanguageIdFromPath('file.xyz')).toBeUndefined();
    });
  });
});
