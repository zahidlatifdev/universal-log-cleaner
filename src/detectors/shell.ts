/**
 * Shell/Bash detector - finds echo statements
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import { buildShellEchoPattern, buildCommentedLogPattern } from '../regexBuilder';

export class ShellDetector implements IDetector {
  languageIds = ['shellscript', 'bash', 'sh'];
  fileExtensions = ['.sh', '.bash', '.zsh'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    // Echo statements
    patterns.push({
      pattern: buildShellEchoPattern(),
      description: 'Shell echo statements',
      mode: 'singleLine',
      priority: 10,
      respectWhitelist: true,
    });

    // Commented logs (if enabled)
    if (config.removeCommentedLogs) {
      patterns.push({
        pattern: buildCommentedLogPattern('#'),
        description: 'Commented echo statements',
        mode: 'singleLine',
        priority: 8,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
