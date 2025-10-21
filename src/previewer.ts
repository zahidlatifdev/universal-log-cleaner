/**
 * Preview UI functionality - shows diffs and allows user to review changes
 */

import * as vscode from 'vscode';
import { WorkspaceCleanResult, FileCleanResult } from './types';
import { generateUnifiedDiff, formatChangeSummary } from './utils/diffUtils';

/**
 * Show preview of cleaning results
 * @param result Workspace cleaning result
 * @returns True if user accepts changes
 */
export async function showPreview(result: WorkspaceCleanResult): Promise<boolean> {
  // Show summary QuickPick
  const modifiedFiles = result.fileResults.filter((r) => r.modified);

  if (modifiedFiles.length === 0) {
    vscode.window.showInformationMessage('No log statements found to clean.');
    return false;
  }

  const summary = formatChangeSummary(
    result.totalLogsRemoved,
    result.totalLogsCommented,
    result.totalFilesModified
  );

  // Create preview items
  const items: vscode.QuickPickItem[] = modifiedFiles.map((fileResult) => ({
    label: `$(file) ${getRelativePath(fileResult.filePath)}`,
    description: `${fileResult.logsRemoved + fileResult.logsCommented} log(s)`,
    detail: fileResult.filePath,
  }));

  items.unshift({
    label: '$(check-all) Accept All Changes',
    description: summary,
    detail: 'Apply all changes to workspace',
  });

  items.push({
    label: '$(close) Cancel',
    description: 'Discard all changes',
  });

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Review changes before applying',
    title: 'Universal Log Cleaner - Preview',
  });

  if (!selected) {
    return false;
  }

  if (selected.label.includes('Accept All')) {
    return true;
  }

  if (selected.label.includes('Cancel')) {
    return false;
  }

  // Show individual file diff
  const fileResult = modifiedFiles.find((r) => r.filePath === selected.detail);
  if (fileResult) {
    await showFileDiff(fileResult);
  }

  return false;
}

/**
 * Show diff for a single file
 * @param fileResult File cleaning result
 */
export async function showFileDiff(fileResult: FileCleanResult): Promise<void> {
  const diff = generateUnifiedDiff(
    fileResult.originalContent,
    fileResult.newContent,
    getRelativePath(fileResult.filePath)
  );

  // Create a virtual document with the diff
  const uri = vscode.Uri.parse(`untitled:${getRelativePath(fileResult.filePath)}.diff`);

  const doc = await vscode.workspace.openTextDocument(uri);
  const editor = await vscode.window.showTextDocument(doc, {
    preview: true,
    preserveFocus: false,
  });

  // Insert diff content
  await editor.edit((editBuilder) => {
    editBuilder.insert(new vscode.Position(0, 0), diff);
  });
}

/**
 * Show cleaning results summary
 * @param result Workspace cleaning result
 */
export async function showResultSummary(result: WorkspaceCleanResult): Promise<void> {
  const summary = formatChangeSummary(
    result.totalLogsRemoved,
    result.totalLogsCommented,
    result.totalFilesModified
  );

  const message = `${summary} in ${result.executionTimeMs}ms`;

  if (result.totalFilesModified > 0) {
    vscode.window.showInformationMessage(`✓ ${message}`);
  } else {
    vscode.window.showInformationMessage('No log statements found.');
  }
}

/**
 * Get relative path from workspace root
 * @param absolutePath Absolute file path
 * @returns Relative path
 */
function getRelativePath(absolutePath: string): string {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return absolutePath;
  }

  for (const folder of workspaceFolders) {
    if (absolutePath.startsWith(folder.uri.fsPath)) {
      return absolutePath.substring(folder.uri.fsPath.length + 1);
    }
  }

  return absolutePath;
}

/**
 * Create status bar item for showing extension state
 */
export function createStatusBarItem(): vscode.StatusBarItem {
  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.text = '$(check) ULC: Ready';
  statusBar.tooltip = 'Universal Log Cleaner';
  statusBar.command = 'universalLogCleaner.preview';
  return statusBar;
}

/**
 * Update status bar with results
 * @param statusBar Status bar item
 * @param result Workspace cleaning result or null
 */
export function updateStatusBar(
  statusBar: vscode.StatusBarItem,
  result: WorkspaceCleanResult | null
): void {
  if (!result) {
    statusBar.text = '$(check) ULC: Ready';
    statusBar.tooltip = 'Universal Log Cleaner';
    return;
  }

  const summary = formatChangeSummary(
    result.totalLogsRemoved,
    result.totalLogsCommented,
    result.totalFilesModified
  );

  statusBar.text = `$(check) ULC: ${result.totalFilesModified} file(s)`;
  statusBar.tooltip = `Universal Log Cleaner\n${summary}`;
}
