/**
 * Rust detector - finds println!, print!, dbg! macros
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import { buildRustPrintPattern, buildCommentedLogPattern } from '../regexBuilder';

export class RustDetector implements IDetector {
  languageIds = ['rust'];
  fileExtensions = ['.rs'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    // Print macros
    patterns.push({
      pattern: buildRustPrintPattern(),
      description: 'Rust println!/print!/dbg! macros',
      mode: 'singleLine',
      priority: 10,
      respectWhitelist: true,
    });

    // Commented logs (if enabled)
    if (config.removeCommentedLogs) {
      patterns.push({
        pattern: buildCommentedLogPattern('//'),
        description: 'Commented print macros',
        mode: 'singleLine',
        priority: 8,
        respectWhitelist: true,
      });

      patterns.push({
        pattern: /\/\*[\s\S]*?(println!|print!|dbg!)[\s\S]*?\*\//g,
        description: 'Block commented print macros',
        mode: 'multiLine',
        priority: 7,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
