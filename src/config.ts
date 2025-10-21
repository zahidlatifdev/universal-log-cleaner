/**
 * Configuration management for Universal Log Cleaner
 * Reads and validates VS Code settings
 */

import * as vscode from 'vscode';
import { CleanerConfig } from './types';

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: CleanerConfig = {
  languages: [
    'javascript',
    'typescript',
    'python',
    'java',
    'php',
    'csharp',
    'go',
    'rust',
    'swift',
    'c',
    'cpp',
    'ruby',
    'dart',
    'shellscript',
    'sql',
    'html',
    'css',
    'scss',
    'less',
    'markdown',
  ],
  mode: 'preview',
  removeCommentedLogs: true,
  maxFileSizeKB: 500,
  whitelistTags: ['@keep', '@preserve'],
  exclude: [
    '**/node_modules/**',
    '**/dist/**',
    '**/out/**',
    '**/build/**',
    '**/.git/**',
    '**/vendor/**',
    '**/target/**',
  ],
  dryRunDefault: true,
  htmlCssHandling: true,
  logTypes: {
    javascript: {
      log: true,
      debug: true,
      info: true,
      warn: true,
      error: true,
      trace: true,
      table: true,
      dir: true,
      assert: true,
      count: true,
      group: true,
      time: true,
    },
    debugger: true,
    allOtherLogs: true,
  },
};

/**
 * Get current configuration from VS Code settings
 * Merges user settings with defaults
 * @returns Current cleaner configuration
 */
export function getConfig(): CleanerConfig {
  const config = vscode.workspace.getConfiguration('universalLogCleaner');

  return {
    languages: config.get<string[]>('languages') ?? DEFAULT_CONFIG.languages,
    mode: config.get<'delete' | 'comment' | 'preview'>('mode') ?? DEFAULT_CONFIG.mode,
    removeCommentedLogs:
      config.get<boolean>('removeCommentedLogs') ?? DEFAULT_CONFIG.removeCommentedLogs,
    maxFileSizeKB: config.get<number>('maxFileSizeKB') ?? DEFAULT_CONFIG.maxFileSizeKB,
    whitelistTags: config.get<string[]>('whitelistTags') ?? DEFAULT_CONFIG.whitelistTags,
    exclude: config.get<string[]>('exclude') ?? DEFAULT_CONFIG.exclude,
    dryRunDefault: config.get<boolean>('dryRunDefault') ?? DEFAULT_CONFIG.dryRunDefault,
    htmlCssHandling: config.get<boolean>('htmlCssHandling') ?? DEFAULT_CONFIG.htmlCssHandling,
    logTypes: config.get('logTypes') ?? DEFAULT_CONFIG.logTypes,
  };
}

/**
 * Update a configuration value
 * @param key Configuration key
 * @param value New value
 * @param target Configuration target (global or workspace)
 */
export async function updateConfig(
  key: keyof CleanerConfig,
  value: unknown,
  target: vscode.ConfigurationTarget = vscode.ConfigurationTarget.Global
): Promise<void> {
  const config = vscode.workspace.getConfiguration('universalLogCleaner');
  await config.update(key, value, target);
}

/**
 * Validate configuration
 * @param config Configuration to validate
 * @returns Validation errors, or empty array if valid
 */
export function validateConfig(config: CleanerConfig): string[] {
  const errors: string[] = [];

  if (config.maxFileSizeKB <= 0) {
    errors.push('maxFileSizeKB must be positive');
  }

  if (config.languages.length === 0) {
    errors.push('At least one language must be enabled');
  }

  if (!['delete', 'comment', 'preview'].includes(config.mode)) {
    errors.push('mode must be one of: delete, comment, preview');
  }

  return errors;
}
