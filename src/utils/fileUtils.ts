/**
 * File system utilities for safe file operations
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { CleanerConfig } from '../types';

/**
 * Check if a file should be excluded based on patterns
 * @param filePath File path to check
 * @param excludePatterns Glob patterns to exclude
 * @returns True if file should be excluded
 */
export function shouldExcludeFile(filePath: string, excludePatterns: string[]): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/');

  for (const pattern of excludePatterns) {
    // Simple glob matching - convert to regex
    // First escape dots, then process wildcards
    const regexPattern = pattern
      .replace(/\./g, '\\.') // Escape dots first
      .replace(/\*\*/g, '___DOUBLESTAR___') // Placeholder for **
      .replace(/\*/g, '[^/]*') // Single * matches anything except /
      .replace(/___DOUBLESTAR___/g, '.*') // ** matches anything including /
      .replace(/\?/g, '.');

    const regex = new RegExp(regexPattern);
    if (regex.test(normalizedPath)) {
      return true;
    }
  }

  return false;
}

/**
 * Get file size in KB
 * @param uri File URI
 * @returns File size in KB, or -1 if unable to determine
 */
export async function getFileSizeKB(uri: vscode.Uri): Promise<number> {
  try {
    const stat = await vscode.workspace.fs.stat(uri);
    return stat.size / 1024;
  } catch {
    return -1;
  }
}

/**
 * Check if file size is within limits
 * @param uri File URI
 * @param maxSizeKB Maximum size in KB
 * @returns True if file is within limits
 */
export async function isFileSizeValid(uri: vscode.Uri, maxSizeKB: number): Promise<boolean> {
  const sizeKB = await getFileSizeKB(uri);
  return sizeKB > 0 && sizeKB <= maxSizeKB;
}

/**
 * Read file content as string
 * @param uri File URI
 * @returns File content
 */
export async function readFileContent(uri: vscode.Uri): Promise<string> {
  const bytes = await vscode.workspace.fs.readFile(uri);
  return Buffer.from(bytes).toString('utf8');
}

/**
 * Write file content
 * @param uri File URI
 * @param content Content to write
 */
export async function writeFileContent(uri: vscode.Uri, content: string): Promise<void> {
  const bytes = Buffer.from(content, 'utf8');
  await vscode.workspace.fs.writeFile(uri, Uint8Array.from(bytes));
}

/**
 * Get language ID from file extension
 * @param filePath File path
 * @returns Language ID or undefined
 */
export function getLanguageIdFromPath(filePath: string): string | undefined {
  const ext = path.extname(filePath).toLowerCase();
  const extMap: Record<string, string> = {
    '.js': 'javascript',
    '.mjs': 'javascript',
    '.cjs': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescriptreact',
    '.jsx': 'javascriptreact',
    '.py': 'python',
    '.java': 'java',
    '.php': 'php',
    '.cs': 'csharp',
    '.go': 'go',
    '.rs': 'rust',
    '.swift': 'swift',
    '.c': 'c',
    '.cpp': 'cpp',
    '.cc': 'cpp',
    '.cxx': 'cpp',
    '.h': 'c',
    '.hpp': 'cpp',
    '.rb': 'ruby',
    '.dart': 'dart',
    '.sh': 'shellscript',
    '.bash': 'shellscript',
    '.zsh': 'shellscript',
    '.sql': 'sql',
    '.html': 'html',
    '.htm': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.less': 'less',
    '.md': 'markdown',
  };

  return extMap[ext];
}

/**
 * Find all files in workspace matching language IDs
 * @param languageIds Language IDs to search for
 * @param config Configuration for exclusions
 * @returns Array of file URIs
 */
export async function findWorkspaceFiles(
  languageIds: string[],
  config: CleanerConfig
): Promise<vscode.Uri[]> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return [];
  }

  const files: vscode.Uri[] = [];

  // Build file extensions to search for
  const extensions = new Set<string>();
  for (const langId of languageIds) {
    const exts = getExtensionsForLanguage(langId);
    exts.forEach((ext) => extensions.add(ext));
  }

  // Search for each extension
  for (const ext of extensions) {
    const pattern = new vscode.RelativePattern(workspaceFolders[0], `**/*${ext}`);
    const foundFiles = await vscode.workspace.findFiles(pattern);
    files.push(...foundFiles);
  }

  // Filter out excluded files
  return files.filter((uri) => !shouldExcludeFile(uri.fsPath, config.exclude));
}

/**
 * Get file extensions for a language ID
 * @param languageId Language ID
 * @returns Array of file extensions
 */
function getExtensionsForLanguage(languageId: string): string[] {
  const map: Record<string, string[]> = {
    javascript: ['.js', '.mjs', '.cjs'],
    typescript: ['.ts'],
    typescriptreact: ['.tsx'],
    javascriptreact: ['.jsx'],
    python: ['.py'],
    java: ['.java'],
    php: ['.php'],
    csharp: ['.cs'],
    go: ['.go'],
    rust: ['.rs'],
    swift: ['.swift'],
    c: ['.c', '.h'],
    cpp: ['.cpp', '.cc', '.cxx', '.hpp'],
    ruby: ['.rb'],
    dart: ['.dart'],
    shellscript: ['.sh', '.bash', '.zsh'],
    sql: ['.sql'],
    html: ['.html', '.htm'],
    css: ['.css'],
    scss: ['.scss'],
    less: ['.less'],
    markdown: ['.md'],
  };

  return map[languageId] || [];
}
