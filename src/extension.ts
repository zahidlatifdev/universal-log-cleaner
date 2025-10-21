/**
 * Extension entry point for Universal Log Cleaner
 * Registers commands and manages extension lifecycle
 */

import * as vscode from 'vscode';
import { getConfig } from './config';
import { cleanFile, cleanFiles } from './cleaner';
import { findWorkspaceFiles } from './utils/fileUtils';
import { showPreview, showResultSummary, createStatusBarItem, updateStatusBar } from './previewer';
import { UndoManager } from './undoManager';

let statusBarItem: vscode.StatusBarItem;
let undoManager: UndoManager;

/**
 * Extension activation
 * Called when extension is first activated
 */
export function activate(context: vscode.ExtensionContext) {
  // Extension is activated

  // Initialize
  undoManager = new UndoManager();
  statusBarItem = createStatusBarItem();
  statusBarItem.show();

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('universalLogCleaner.cleanWorkspace', async () => {
      await cleanWorkspaceCommand();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('universalLogCleaner.cleanFile', async () => {
      await cleanFileCommand();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('universalLogCleaner.preview', async () => {
      await previewCommand();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('universalLogCleaner.undo', async () => {
      await undoCommand();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('universalLogCleaner.openSettings', async () => {
      await vscode.commands.executeCommand('workbench.action.openSettings', 'universalLogCleaner');
    })
  );

  context.subscriptions.push(statusBarItem);
}

/**
 * Extension deactivation
 * Cleanup resources
 */
export function deactivate() {
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}

/**
 * Clean workspace command
 */
async function cleanWorkspaceCommand() {
  const config = getConfig();

  try {
    // Find all files
    const files = await findWorkspaceFiles(config.languages, config);

    if (files.length === 0) {
      vscode.window.showInformationMessage('No files found to clean.');
      return;
    }

    // Confirm action
    const confirm = await vscode.window.showQuickPick(['Yes', 'No'], {
      placeHolder: `Clean ${files.length} file(s) in workspace?`,
      title: 'Universal Log Cleaner',
    });

    if (confirm !== 'Yes') {
      return;
    }

    // Show progress
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Cleaning workspace...',
        cancellable: false,
      },
      async (progress) => {
        // Dry run first
        progress.report({ message: 'Analyzing files...' });
        const dryRunResult = await cleanFiles(files, config, true);

        if (dryRunResult.totalFilesModified === 0) {
          vscode.window.showInformationMessage('No log statements found.');
          return;
        }

        // Show preview
        const accepted = await showPreview(dryRunResult);
        if (!accepted) {
          vscode.window.showInformationMessage('Operation cancelled.');
          return;
        }

        // Save undo state
        const filesToUndo = dryRunResult.fileResults
          .filter((r) => r.modified)
          .map((r) => ({
            filePath: r.filePath,
            originalContent: r.originalContent,
          }));

        undoManager.saveState(filesToUndo, `Cleaned ${dryRunResult.totalFilesModified} file(s)`);

        // Apply changes
        progress.report({ message: 'Applying changes...' });
        const result = await cleanFiles(files, config, false);

        updateStatusBar(statusBarItem, result);
        await showResultSummary(result);
      }
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error cleaning workspace: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Clean current file command
 */
async function cleanFileCommand() {
  const config = getConfig();
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showWarningMessage('No active editor.');
    return;
  }

  try {
    // Dry run first
    const dryRunResult = await cleanFile(editor.document.uri, config, true);

    if (dryRunResult.error) {
      vscode.window.showErrorMessage(`Error: ${dryRunResult.error}`);
      return;
    }

    if (!dryRunResult.modified) {
      vscode.window.showInformationMessage('No log statements found in this file.');
      return;
    }

    // Confirm
    const logsCount = dryRunResult.logsRemoved + dryRunResult.logsCommented;
    const confirm = await vscode.window.showQuickPick(['Yes', 'No'], {
      placeHolder: `Remove ${logsCount} log statement(s) from this file?`,
      title: 'Universal Log Cleaner',
    });

    if (confirm !== 'Yes') {
      return;
    }

    // Save undo state
    undoManager.saveState(
      [{ filePath: editor.document.uri.fsPath, originalContent: dryRunResult.originalContent }],
      `Cleaned ${editor.document.uri.fsPath}`
    );

    // Apply changes
    const result = await cleanFile(editor.document.uri, config, false);

    if (result.modified) {
      vscode.window.showInformationMessage(
        `✓ Removed ${result.logsRemoved} log(s), commented ${result.logsCommented} log(s)`
      );
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error cleaning file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Preview command - dry run without modifications
 */
async function previewCommand() {
  const config = getConfig();
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showWarningMessage('No active editor.');
    return;
  }

  try {
    const result = await cleanFile(editor.document.uri, config, true);

    if (result.error) {
      vscode.window.showErrorMessage(`Error: ${result.error}`);
      return;
    }

    if (!result.modified) {
      vscode.window.showInformationMessage('No log statements found in this file.');
      return;
    }

    // Show preview in QuickPick
    const logsCount = result.logsRemoved + result.logsCommented;
    const items: vscode.QuickPickItem[] = result.matches.map((match) => ({
      label: `$(file-code) Line ${match.startLine + 1}`,
      description: match.pattern.description,
      detail: match.text.substring(0, 100),
    }));

    items.unshift({
      label: '$(check) Apply Changes',
      description: `Remove ${logsCount} log(s)`,
    });

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Preview log statements to be removed',
      title: 'Universal Log Cleaner - Preview',
    });

    if (selected && selected.label.includes('Apply')) {
      await cleanFileCommand();
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error previewing: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Undo command - restore last changes
 */
async function undoCommand() {
  if (!undoManager.canUndo()) {
    vscode.window.showWarningMessage('No changes to undo.');
    return;
  }

  try {
    const summary = undoManager.getUndoSummary();
    const confirm = await vscode.window.showQuickPick(['Yes', 'No'], {
      placeHolder: `Undo: ${summary}`,
      title: 'Universal Log Cleaner - Undo',
    });

    if (confirm !== 'Yes') {
      return;
    }

    const restoredCount = await undoManager.undo();
    vscode.window.showInformationMessage(`✓ Restored ${restoredCount} file(s)`);

    updateStatusBar(statusBarItem, null);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error undoing changes: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
