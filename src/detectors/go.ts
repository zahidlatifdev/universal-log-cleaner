/**
 * Go detector - finds fmt.Print* statements
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import { buildGoFmtPattern, buildCommentedLogPattern } from '../regexBuilder';

export class GoDetector implements IDetector {
  languageIds = ['go'];
  fileExtensions = ['.go'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    // fmt.Print* functions
    patterns.push({
      pattern: buildGoFmtPattern(),
      description: 'Go fmt.Print* statements',
      mode: 'singleLine',
      priority: 10,
      respectWhitelist: true,
    });

    // Commented logs (if enabled)
    if (config.removeCommentedLogs) {
      patterns.push({
        pattern: buildCommentedLogPattern('//'),
        description: 'Commented fmt statements',
        mode: 'singleLine',
        priority: 8,
        respectWhitelist: true,
      });

      patterns.push({
        pattern: /\/\*[\s\S]*?fmt\.(Print|Printf|Println)[\s\S]*?\*\//g,
        description: 'Block commented fmt statements',
        mode: 'multiLine',
        priority: 7,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
