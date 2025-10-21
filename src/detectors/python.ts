/**
 * Python detector - finds print() statements
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import { buildPythonPrintPattern, buildCommentedLogPattern } from '../regexBuilder';

export class PythonDetector implements IDetector {
  languageIds = ['python'];
  fileExtensions = ['.py'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    // Print statements (if allOtherLogs enabled)
    if (config.logTypes.allOtherLogs) {
      patterns.push({
        pattern: buildPythonPrintPattern(),
        description: 'Python print() statements',
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
    }

    return patterns;
  }
}
