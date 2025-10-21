/**
 * Less detector - finds debug comments
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import { buildCommentedLogPattern } from '../regexBuilder';

export class LessDetector implements IDetector {
  languageIds = ['less'];
  fileExtensions = ['.less'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    if (config.htmlCssHandling && config.removeCommentedLogs) {
      // Less single-line comments
      patterns.push({
        pattern: buildCommentedLogPattern('//'),
        description: 'Less single-line comments',
        mode: 'singleLine',
        priority: 5,
        respectWhitelist: true,
      });

      // Less block comments
      patterns.push({
        pattern: /\/\*[\s\S]*?\*\//g,
        description: 'Less block comments',
        mode: 'multiLine',
        priority: 5,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
