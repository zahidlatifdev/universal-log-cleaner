/**
 * Ruby detector - finds puts, print, p statements
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import { buildRubyPutsPattern, buildCommentedLogPattern } from '../regexBuilder';

export class RubyDetector implements IDetector {
  languageIds = ['ruby'];
  fileExtensions = ['.rb'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    // Puts/print/p
    patterns.push({
      pattern: buildRubyPutsPattern(),
      description: 'Ruby puts/print/p statements',
      mode: 'singleLine',
      priority: 10,
      respectWhitelist: true,
    });

    // Commented logs (if enabled)
    if (config.removeCommentedLogs) {
      patterns.push({
        pattern: buildCommentedLogPattern('#'),
        description: 'Commented print statements',
        mode: 'singleLine',
        priority: 8,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
