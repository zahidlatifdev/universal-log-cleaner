/**
 * CSS detector - finds debug comments
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';

export class CSSDetector implements IDetector {
  languageIds = ['css'];
  fileExtensions = ['.css'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    if (config.htmlCssHandling && config.removeCommentedLogs) {
      // CSS comments
      patterns.push({
        pattern: /\/\*[\s\S]*?\*\//g,
        description: 'CSS block comments',
        mode: 'multiLine',
        priority: 5,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
