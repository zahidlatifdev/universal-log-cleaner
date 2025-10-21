/**
 * SQL detector - finds PRINT and RAISERROR statements
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import { buildSQLPrintPattern, buildCommentedLogPattern } from '../regexBuilder';

export class SQLDetector implements IDetector {
  languageIds = ['sql'];
  fileExtensions = ['.sql'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    // PRINT/RAISERROR
    patterns.push({
      pattern: buildSQLPrintPattern(),
      description: 'SQL PRINT/RAISERROR statements',
      mode: 'singleLine',
      priority: 10,
      respectWhitelist: true,
    });

    // Commented logs (if enabled)
    if (config.removeCommentedLogs) {
      patterns.push({
        pattern: buildCommentedLogPattern('--'),
        description: 'Commented PRINT statements',
        mode: 'singleLine',
        priority: 8,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
