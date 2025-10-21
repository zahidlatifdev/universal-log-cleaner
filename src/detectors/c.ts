/**
 * C detector - finds printf and related functions
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import { buildCPrintfPattern, buildCommentedLogPattern } from '../regexBuilder';

export class CDetector implements IDetector {
  languageIds = ['c'];
  fileExtensions = ['.c', '.h'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    // Printf functions
    patterns.push({
      pattern: buildCPrintfPattern(),
      description: 'C printf/fprintf statements',
      mode: 'singleLine',
      priority: 10,
      respectWhitelist: true,
    });

    // Commented logs (if enabled)
    if (config.removeCommentedLogs) {
      patterns.push({
        pattern: buildCommentedLogPattern('//'),
        description: 'Commented printf statements',
        mode: 'singleLine',
        priority: 8,
        respectWhitelist: true,
      });

      patterns.push({
        pattern: /\/\*[\s\S]*?(printf|fprintf)[\s\S]*?\*\//g,
        description: 'Block commented printf statements',
        mode: 'multiLine',
        priority: 7,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
