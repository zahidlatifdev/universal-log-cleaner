/**
 * Whitelist tag checking utilities
 * Detects special tags like @keep, @preserve that prevent log removal
 */

import { CleanerConfig } from '../types';

/**
 * Check if content has whitelist tags that prevent removal
 * @param content Content to check
 * @param lineNumber Line number to check (0-indexed)
 * @param config Configuration with whitelist tags
 * @returns True if content should be kept
 */
export function hasWhitelistTag(
  content: string,
  lineNumber: number,
  config: CleanerConfig
): boolean {
  const lines = content.split('\n');
  if (lineNumber < 0 || lineNumber >= lines.length) {
    return false;
  }

  // Check current line and previous line for whitelist tags
  const linesToCheck = [lines[lineNumber]];
  if (lineNumber > 0) {
    linesToCheck.push(lines[lineNumber - 1]);
  }

  for (const line of linesToCheck) {
    for (const tag of config.whitelistTags) {
      if (line.includes(tag)) {
        return true;
      }
    }

    // Also check for common keep patterns
    if (
      /\/\/\s*keep/i.test(line) ||
      /\/\*\s*keep/i.test(line) ||
      /#\s*keep/i.test(line) ||
      /--\s*keep/i.test(line)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a range of lines has whitelist tags
 * @param content Full content
 * @param startLine Start line (0-indexed)
 * @param endLine End line (0-indexed)
 * @param config Configuration
 * @returns True if any line in range should be kept
 */
export function hasWhitelistTagInRange(
  content: string,
  startLine: number,
  endLine: number,
  config: CleanerConfig
): boolean {
  for (let i = startLine; i <= endLine; i++) {
    if (hasWhitelistTag(content, i, config)) {
      return true;
    }
  }
  return false;
}
