/**
 * Java detector - finds System.out.println and similar
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import { buildJavaSystemOutPattern, buildCommentedLogPattern } from '../regexBuilder';

export class JavaDetector implements IDetector {
  languageIds = ['java'];
  fileExtensions = ['.java'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    // System.out/err
    patterns.push({
      pattern: buildJavaSystemOutPattern(),
      description: 'Java System.out/err statements',
      mode: 'singleLine',
      priority: 10,
      respectWhitelist: true,
    });

    // Commented logs (if enabled)
    if (config.removeCommentedLogs) {
      patterns.push({
        pattern: buildCommentedLogPattern('//'),
        description: 'Commented System.out statements',
        mode: 'singleLine',
        priority: 8,
        respectWhitelist: true,
      });

      patterns.push({
        pattern: /\/\*[\s\S]*?System\.(out|err)\.(print|println)[\s\S]*?\*\//g,
        description: 'Block commented System.out statements',
        mode: 'multiLine',
        priority: 7,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
