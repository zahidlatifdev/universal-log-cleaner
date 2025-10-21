/**
 * Core cleaning logic - detects and removes/comments log statements
 */

import * as vscode from 'vscode';
import { CleanerConfig, FileCleanResult, MatchResult, WorkspaceCleanResult } from './types';
import { getDetectorForLanguage } from './detectors/registry';
import { hasWhitelistTagInRange } from './utils/whitelistChecker';
import { isFileSizeValid, readFileContent, writeFileContent } from './utils/fileUtils';

/**
 * Clean a single file
 * @param uri File URI
 * @param config Configuration
 * @param dryRun If true, don't modify the file
 * @returns Cleaning result
 */
export async function cleanFile(
  uri: vscode.Uri,
  config: CleanerConfig,
  dryRun: boolean = true
): Promise<FileCleanResult> {
  const result: FileCleanResult = {
    filePath: uri.fsPath,
    originalContent: '',
    newContent: '',
    matches: [],
    logsRemoved: 0,
    logsCommented: 0,
    modified: false,
  };

  try {
    // Check file size
    const isValid = await isFileSizeValid(uri, config.maxFileSizeKB);
    if (!isValid) {
      result.error = `File size exceeds limit of ${config.maxFileSizeKB} KB`;
      return result;
    }

    // Read file content
    const content = await readFileContent(uri);
    result.originalContent = content;
    result.newContent = content;

    // Get language detector
    const document = await vscode.workspace.openTextDocument(uri);
    const detector = getDetectorForLanguage(document.languageId);

    if (!detector) {
      result.error = `No detector found for language: ${document.languageId}`;
      return result;
    }

    // Build patterns
    const patterns = detector.buildPatterns(config);

    // Find all matches
    const matches: MatchResult[] = [];

    for (const pattern of patterns) {
      const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(content)) !== null) {
        const matchText = match[0];
        const matchIndex = match.index;

        // Calculate line numbers
        const beforeMatch = content.substring(0, matchIndex);
        const startLine = beforeMatch.split('\n').length - 1;
        const endLine = startLine + matchText.split('\n').length - 1;
        const startChar = beforeMatch.length - beforeMatch.lastIndexOf('\n') - 1;
        const endChar = startChar + matchText.length;

        // Check whitelist
        const shouldKeep =
          pattern.respectWhitelist !== false &&
          hasWhitelistTagInRange(content, startLine, endLine, config);

        matches.push({
          text: matchText,
          startLine,
          endLine,
          startChar,
          endChar,
          pattern,
          shouldKeep,
        });
      }
    }

    // Sort matches by position (reverse order for safe deletion)
    matches.sort((a, b) => b.startLine - a.startLine || b.startChar - a.startChar);

    // Apply changes
    let newContent = content;
    const lines = content.split('\n');

    for (const match of matches) {
      if (match.shouldKeep) {
        continue;
      }

      if (config.mode === 'delete') {
        // Remove the log statement
        // Handle line removal
        if (match.startLine === match.endLine) {
          // Single line - remove entire line if it only contains the match
          const line = lines[match.startLine];
          const trimmed = line.trim();
          if (trimmed === match.text.trim() || trimmed === match.text.trim() + ';') {
            // Remove entire line
            lines.splice(match.startLine, 1);
            result.logsRemoved++;
          } else {
            // Remove just the match
            lines[match.startLine] = line.replace(match.text, '');
            result.logsRemoved++;
          }
        } else {
          // Multi-line - remove entire range
          lines.splice(match.startLine, match.endLine - match.startLine + 1);
          result.logsRemoved++;
        }
      } else if (config.mode === 'comment') {
        // Comment out the log statement
        const commentPrefix = getCommentPrefix(document.languageId);
        if (match.startLine === match.endLine) {
          lines[match.startLine] = commentPrefix + lines[match.startLine];
        } else {
          for (let i = match.startLine; i <= match.endLine; i++) {
            lines[i] = commentPrefix + lines[i];
          }
        }
        result.logsCommented++;
      }
    }

    newContent = lines.join('\n');
    result.newContent = newContent;
    result.matches = matches.filter((m) => !m.shouldKeep);
    result.modified = newContent !== content;

    // Write changes if not dry run
    if (!dryRun && result.modified) {
      await writeFileContent(uri, newContent);
    }
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
  }

  return result;
}

/**
 * Clean multiple files
 * @param uris File URIs to clean
 * @param config Configuration
 * @param dryRun If true, don't modify files
 * @returns Workspace cleaning result
 */
export async function cleanFiles(
  uris: vscode.Uri[],
  config: CleanerConfig,
  dryRun: boolean = true
): Promise<WorkspaceCleanResult> {
  const startTime = Date.now();
  const fileResults: FileCleanResult[] = [];

  for (const uri of uris) {
    const result = await cleanFile(uri, config, dryRun);
    fileResults.push(result);
  }

  const totalLogsRemoved = fileResults.reduce((sum, r) => sum + r.logsRemoved, 0);
  const totalLogsCommented = fileResults.reduce((sum, r) => sum + r.logsCommented, 0);
  const totalFilesModified = fileResults.filter((r) => r.modified).length;

  return {
    fileResults,
    totalLogsRemoved,
    totalLogsCommented,
    totalFilesModified,
    executionTimeMs: Date.now() - startTime,
  };
}

/**
 * Get comment prefix for a language
 * @param languageId Language identifier
 * @returns Comment prefix
 */
function getCommentPrefix(languageId: string): string {
  const prefixMap: Record<string, string> = {
    javascript: '// ',
    typescript: '// ',
    javascriptreact: '// ',
    typescriptreact: '// ',
    java: '// ',
    csharp: '// ',
    go: '// ',
    rust: '// ',
    swift: '// ',
    c: '// ',
    cpp: '// ',
    dart: '// ',
    php: '// ',
    python: '# ',
    ruby: '# ',
    shellscript: '# ',
    sql: '-- ',
    html: '<!-- ',
    css: '/* ',
    scss: '// ',
    less: '// ',
    markdown: '<!-- ',
  };

  return prefixMap[languageId] || '// ';
}
