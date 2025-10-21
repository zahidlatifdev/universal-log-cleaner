/**
 * Whitelist checker tests
 */

import { hasWhitelistTag, hasWhitelistTagInRange } from '../../src/utils/whitelistChecker';
import { DEFAULT_CONFIG } from '../../src/config';

describe('WhitelistChecker', () => {
  describe('hasWhitelistTag', () => {
    it('should detect @keep tag', () => {
      const content = `// @keep\nconsole.log('test');`;
      const result = hasWhitelistTag(content, 1, DEFAULT_CONFIG);
      expect(result).toBe(true);
    });

    it('should detect @preserve tag', () => {
      const content = `// @preserve\nconsole.log('test');`;
      const result = hasWhitelistTag(content, 1, DEFAULT_CONFIG);
      expect(result).toBe(true);
    });

    it('should detect keep comment', () => {
      const content = `// keep-log\nconsole.log('test');`;
      const result = hasWhitelistTag(content, 1, DEFAULT_CONFIG);
      expect(result).toBe(true);
    });

    it('should not detect when no tag present', () => {
      const content = `console.log('test');`;
      const result = hasWhitelistTag(content, 0, DEFAULT_CONFIG);
      expect(result).toBe(false);
    });

    it('should check previous line', () => {
      const content = `// @keep\nconsole.log('test');`;
      const result = hasWhitelistTag(content, 1, DEFAULT_CONFIG);
      expect(result).toBe(true);
    });
  });

  describe('hasWhitelistTagInRange', () => {
    it('should detect tag in range', () => {
      const content = `line 1\n// @keep\nconsole.log('test');\nline 4`;
      const result = hasWhitelistTagInRange(content, 1, 2, DEFAULT_CONFIG);
      expect(result).toBe(true);
    });

    it('should not detect tag outside range', () => {
      const content = `line 1\nconsole.log('test');\n// @keep\nline 4`;
      const result = hasWhitelistTagInRange(content, 1, 1, DEFAULT_CONFIG);
      expect(result).toBe(false);
    });
  });
});
