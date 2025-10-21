/**
 * TypeScript detector - extends JavaScript detection
 */

import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import {
  buildJSConsolePattern,
  buildCommentedLogPattern,
  buildDebuggerPattern,
} from '../regexBuilder';

export class TypeScriptDetector implements IDetector {
  languageIds = ['typescript', 'typescriptreact'];
  fileExtensions = ['.ts', '.tsx'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    // Build list of enabled console methods (same as JavaScript)
    const enabledMethods: string[] = [];
    const jsConfig = config.logTypes.javascript;
    if (jsConfig.log) enabledMethods.push('log');
    if (jsConfig.debug) enabledMethods.push('debug');
    if (jsConfig.info) enabledMethods.push('info');
    if (jsConfig.warn) enabledMethods.push('warn');
    if (jsConfig.error) enabledMethods.push('error');
    if (jsConfig.trace) enabledMethods.push('trace');
    if (jsConfig.table) enabledMethods.push('table');
    if (jsConfig.dir) enabledMethods.push('dir', 'dirxml');
    if (jsConfig.assert) enabledMethods.push('assert');
    if (jsConfig.count) enabledMethods.push('count', 'countReset');
    if (jsConfig.group) enabledMethods.push('group', 'groupCollapsed', 'groupEnd');
    if (jsConfig.time) enabledMethods.push('time', 'timeEnd', 'timeLog');

    // Console methods (if any enabled)
    if (enabledMethods.length > 0) {
      patterns.push({
        pattern: buildJSConsolePattern(enabledMethods),
        description: 'TypeScript console.* statements',
        mode: 'singleLine',
        priority: 10,
        respectWhitelist: true,
      });
    }

    // Debugger statements
    if (config.logTypes.debugger) {
      patterns.push({
        pattern: buildDebuggerPattern(),
        description: 'Debugger statements',
        mode: 'singleLine',
        priority: 5,
        respectWhitelist: true,
      });
    }

    // Commented logs (if enabled)
    if (config.removeCommentedLogs && enabledMethods.length > 0) {
      patterns.push({
        pattern: buildCommentedLogPattern('//'),
        description: 'Single-line commented console statements',
        mode: 'singleLine',
        priority: 8,
        respectWhitelist: true,
      });

      patterns.push({
        pattern: /\/\*[\s\S]*?console\.(log|debug|info|warn|error)[\s\S]*?\*\//g,
        description: 'Block commented console statements',
        mode: 'multiLine',
        priority: 7,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
