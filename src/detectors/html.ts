/**
 * HTML detector - finds console.log in <script> tags
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import { buildHTMLConsolePattern } from '../regexBuilder';

export class HTMLDetector implements IDetector {
  languageIds = ['html'];
  fileExtensions = ['.html', '.htm'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    if (config.htmlCssHandling) {
      // Console in script tags
      patterns.push({
        pattern: buildHTMLConsolePattern(),
        description: 'HTML inline console statements',
        mode: 'singleLine',
        priority: 10,
        respectWhitelist: true,
      });

      // HTML comments (if enabled)
      if (config.removeCommentedLogs) {
        patterns.push({
          pattern: /<!--[\s\S]*?-->/g,
          description: 'HTML comments',
          mode: 'multiLine',
          priority: 5,
          respectWhitelist: true,
        });
      }
    }

    return patterns;
  }
}
