/**
 * Swift detector - finds print() statements
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import { buildSwiftPrintPattern, buildCommentedLogPattern } from '../regexBuilder';

export class SwiftDetector implements IDetector {
  languageIds = ['swift'];
  fileExtensions = ['.swift'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    // Print statements
    patterns.push({
      pattern: buildSwiftPrintPattern(),
      description: 'Swift print() statements',
      mode: 'singleLine',
      priority: 10,
      respectWhitelist: true,
    });

    // Commented logs (if enabled)
    if (config.removeCommentedLogs) {
      patterns.push({
        pattern: buildCommentedLogPattern('//'),
        description: 'Commented print statements',
        mode: 'singleLine',
        priority: 8,
        respectWhitelist: true,
      });

      patterns.push({
        pattern: /\/\*[\s\S]*?print\s*\([\s\S]*?\*\//g,
        description: 'Block commented print statements',
        mode: 'multiLine',
        priority: 7,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
