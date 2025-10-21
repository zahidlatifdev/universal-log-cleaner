/**
 * Undo manager - handles single-level undo of cleaning operations
 */

import * as vscode from 'vscode';
import { UndoState } from './types';
import { writeFileContent } from './utils/fileUtils';

/**
 * Undo manager class - stores and restores file states
 */
export class UndoManager {
  private undoState: UndoState | null = null;

  /**
   * Save current state for undo
   * @param files Files and their original content
   * @param summary Summary message
   */
  saveState(files: Array<{ filePath: string; originalContent: string }>, summary: string): void {
    this.undoState = {
      timestamp: Date.now(),
      files,
      summary,
    };
  }

  /**
   * Check if undo is available
   * @returns True if undo state exists
   */
  canUndo(): boolean {
    return this.undoState !== null;
  }

  /**
   * Get undo state summary
   * @returns Summary or null
   */
  getUndoSummary(): string | null {
    return this.undoState?.summary ?? null;
  }

  /**
   * Restore files to previous state
   * @returns Number of files restored
   */
  async undo(): Promise<number> {
    if (!this.undoState) {
      throw new Error('No undo state available');
    }

    let restoredCount = 0;

    for (const file of this.undoState.files) {
      try {
        const uri = vscode.Uri.file(file.filePath);
        await writeFileContent(uri, file.originalContent);
        restoredCount++;
      } catch (error) {
        // Silent fail - error will be reported to user through return value
        void error;
      }
    }

    // Clear undo state after use
    this.undoState = null;

    return restoredCount;
  }

  /**
   * Clear undo state
   */
  clear(): void {
    this.undoState = null;
  }
}
