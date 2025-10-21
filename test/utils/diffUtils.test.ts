/**
 * Diff utils tests
 */

import { formatChangeSummary, generateUnifiedDiff } from '../../src/utils/diffUtils';

describe('DiffUtils', () => {
  describe('formatChangeSummary', () => {
    it('should format when no changes', () => {
      const summary = formatChangeSummary(0, 0, 0);
      expect(summary).toBe('No changes made');
    });

    it('should format removed logs', () => {
      const summary = formatChangeSummary(5, 0, 2);
      expect(summary).toContain('2 files modified');
      expect(summary).toContain('5 logs removed');
    });

    it('should format commented logs', () => {
      const summary = formatChangeSummary(0, 3, 1);
      expect(summary).toContain('1 file modified');
      expect(summary).toContain('3 logs commented');
    });

    it('should format both removed and commented', () => {
      const summary = formatChangeSummary(2, 3, 2);
      expect(summary).toContain('2 files modified');
      expect(summary).toContain('2 logs removed');
      expect(summary).toContain('3 logs commented');
    });
  });

  describe('generateUnifiedDiff', () => {
    it('should generate diff for single line change', () => {
      const original = 'line 1\nline 2\nline 3';
      const modified = 'line 1\nmodified\nline 3';
      const diff = generateUnifiedDiff(original, modified, 'test.txt');

      expect(diff).toContain('--- test.txt');
      expect(diff).toContain('+++ test.txt');
      expect(diff).toContain('-line 2');
      expect(diff).toContain('+modified');
    });

    it('should generate diff for line removal', () => {
      const original = 'line 1\nline 2\nline 3';
      const modified = 'line 1\nline 3';
      const diff = generateUnifiedDiff(original, modified, 'test.txt');

      expect(diff).toContain('-line 2');
    });

    it('should generate diff for line addition', () => {
      const original = 'line 1\nline 3';
      const modified = 'line 1\nline 2\nline 3';
      const diff = generateUnifiedDiff(original, modified, 'test.txt');

      expect(diff).toContain('+line 2');
    });
  });
});
