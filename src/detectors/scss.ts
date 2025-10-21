/**
 * SCSS detector - finds debug comments and statements
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import { buildCommentedLogPattern } from '../regexBuilder';

export class SCSSDetector implements IDetector {
  languageIds = ['scss'];
  fileExtensions = ['.scss'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    if (config.htmlCssHandling && config.removeCommentedLogs) {
      // SCSS single-line comments
      patterns.push({
        pattern: buildCommentedLogPattern('//'),
        description: 'SCSS single-line comments',
        mode: 'singleLine',
        priority: 5,
        respectWhitelist: true,
      });

      // SCSS block comments
      patterns.push({
        pattern: /\/\*[\s\S]*?\*\//g,
        description: 'SCSS block comments',
        mode: 'multiLine',
        priority: 5,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
