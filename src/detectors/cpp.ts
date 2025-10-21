/**
 * C++ detector - finds cout and printf statements
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import {
  buildCppCoutPattern,
  buildCPrintfPattern,
  buildCommentedLogPattern,
} from '../regexBuilder';

export class CppDetector implements IDetector {
  languageIds = ['cpp'];
  fileExtensions = ['.cpp', '.cc', '.cxx', '.hpp'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    // Cout statements
    patterns.push({
      pattern: buildCppCoutPattern(),
      description: 'C++ cout statements',
      mode: 'singleLine',
      priority: 10,
      respectWhitelist: true,
    });

    // Printf (C compatibility)
    patterns.push({
      pattern: buildCPrintfPattern(),
      description: 'C++ printf statements',
      mode: 'singleLine',
      priority: 9,
      respectWhitelist: true,
    });

    // Commented logs (if enabled)
    if (config.removeCommentedLogs) {
      patterns.push({
        pattern: buildCommentedLogPattern('//'),
        description: 'Commented output statements',
        mode: 'singleLine',
        priority: 8,
        respectWhitelist: true,
      });

      patterns.push({
        pattern: /\/\*[\s\S]*?(cout|printf)[\s\S]*?\*\//g,
        description: 'Block commented output statements',
        mode: 'multiLine',
        priority: 7,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
