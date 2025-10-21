/**
 * C# detector - finds Console.WriteLine and similar
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import { buildCSharpConsolePattern, buildCommentedLogPattern } from '../regexBuilder';

export class CSharpDetector implements IDetector {
  languageIds = ['csharp'];
  fileExtensions = ['.cs'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    // Console.WriteLine
    patterns.push({
      pattern: buildCSharpConsolePattern(),
      description: 'C# Console.* statements',
      mode: 'singleLine',
      priority: 10,
      respectWhitelist: true,
    });

    // Commented logs (if enabled)
    if (config.removeCommentedLogs) {
      patterns.push({
        pattern: buildCommentedLogPattern('//'),
        description: 'Commented Console statements',
        mode: 'singleLine',
        priority: 8,
        respectWhitelist: true,
      });

      patterns.push({
        pattern: /\/\*[\s\S]*?Console\.(Write|WriteLine)[\s\S]*?\*\//g,
        description: 'Block commented Console statements',
        mode: 'multiLine',
        priority: 7,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
