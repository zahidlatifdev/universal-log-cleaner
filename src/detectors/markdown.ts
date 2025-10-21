/**
 * Markdown detector - finds HTML comments
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';

export class MarkdownDetector implements IDetector {
  languageIds = ['markdown'];
  fileExtensions = ['.md'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    if (config.htmlCssHandling && config.removeCommentedLogs) {
      // HTML comments in markdown
      patterns.push({
        pattern: /<!--[\s\S]*?-->/g,
        description: 'Markdown HTML comments',
        mode: 'multiLine',
        priority: 5,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
