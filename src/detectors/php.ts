/**
 * PHP detector - finds echo, print, var_dump, etc.
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import { buildPHPEchoPattern, buildCommentedLogPattern } from '../regexBuilder';

export class PHPDetector implements IDetector {
  languageIds = ['php'];
  fileExtensions = ['.php'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    // Echo, print, var_dump
    patterns.push({
      pattern: buildPHPEchoPattern(),
      description: 'PHP echo/print/var_dump statements',
      mode: 'singleLine',
      priority: 10,
      respectWhitelist: true,
    });

    // Commented logs (if enabled)
    if (config.removeCommentedLogs) {
      patterns.push({
        pattern: buildCommentedLogPattern('//'),
        description: 'Commented PHP debug statements',
        mode: 'singleLine',
        priority: 8,
        respectWhitelist: true,
      });

      patterns.push({
        pattern: /\/\*[\s\S]*?(echo|print|var_dump)[\s\S]*?\*\//g,
        description: 'Block commented PHP debug statements',
        mode: 'multiLine',
        priority: 7,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
