/**
 * Unified diff generation utilities
 */

/**
 * Generate unified diff between two strings
 * @param original Original content
 * @param modified Modified content
 * @param filename File name for diff header
 * @returns Unified diff string
 */
export function generateUnifiedDiff(original: string, modified: string, filename: string): string {
  const originalLines = original.split('\n');
  const modifiedLines = modified.split('\n');

  const diff: string[] = [];
  diff.push(`--- ${filename}`);
  diff.push(`+++ ${filename}`);

  // Simple line-by-line diff
  let i = 0;
  let j = 0;
  const chunks: Array<{
    originalStart: number;
    originalLength: number;
    modifiedStart: number;
    modifiedLength: number;
    lines: string[];
  }> = [];
  let currentChunk: (typeof chunks)[0] | null = null;

  while (i < originalLines.length || j < modifiedLines.length) {
    if (i >= originalLines.length) {
      // Additions at end
      if (!currentChunk) {
        currentChunk = {
          originalStart: i + 1,
          originalLength: 0,
          modifiedStart: j + 1,
          modifiedLength: 0,
          lines: [],
        };
      }
      currentChunk.lines.push(`+${modifiedLines[j]}`);
      currentChunk.modifiedLength++;
      j++;
    } else if (j >= modifiedLines.length) {
      // Deletions at end
      if (!currentChunk) {
        currentChunk = {
          originalStart: i + 1,
          originalLength: 0,
          modifiedStart: j + 1,
          modifiedLength: 0,
          lines: [],
        };
      }
      currentChunk.lines.push(`-${originalLines[i]}`);
      currentChunk.originalLength++;
      i++;
    } else if (originalLines[i] === modifiedLines[j]) {
      // Lines match - close chunk if exists
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = null;
      }
      i++;
      j++;
    } else {
      // Lines differ
      if (!currentChunk) {
        currentChunk = {
          originalStart: i + 1,
          originalLength: 0,
          modifiedStart: j + 1,
          modifiedLength: 0,
          lines: [],
        };
      }

      // Check if it's a deletion, addition, or change
      if (modifiedLines.slice(j).includes(originalLines[i])) {
        // Addition
        currentChunk.lines.push(`+${modifiedLines[j]}`);
        currentChunk.modifiedLength++;
        j++;
      } else if (originalLines.slice(i).includes(modifiedLines[j])) {
        // Deletion
        currentChunk.lines.push(`-${originalLines[i]}`);
        currentChunk.originalLength++;
        i++;
      } else {
        // Change
        currentChunk.lines.push(`-${originalLines[i]}`);
        currentChunk.lines.push(`+${modifiedLines[j]}`);
        currentChunk.originalLength++;
        currentChunk.modifiedLength++;
        i++;
        j++;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  // Format chunks
  for (const chunk of chunks) {
    diff.push(
      `@@ -${chunk.originalStart},${chunk.originalLength} +${chunk.modifiedStart},${chunk.modifiedLength} @@`
    );
    diff.push(...chunk.lines);
  }

  return diff.join('\n');
}

/**
 * Format a summary of changes
 * @param logsRemoved Number of logs removed
 * @param logsCommented Number of logs commented
 * @param filesModified Number of files modified
 * @returns Formatted summary string
 */
export function formatChangeSummary(
  logsRemoved: number,
  logsCommented: number,
  filesModified: number
): string {
  const parts: string[] = [];

  if (filesModified === 0) {
    return 'No changes made';
  }

  parts.push(`${filesModified} file${filesModified === 1 ? '' : 's'} modified`);

  if (logsRemoved > 0) {
    parts.push(`${logsRemoved} log${logsRemoved === 1 ? '' : 's'} removed`);
  }

  if (logsCommented > 0) {
    parts.push(`${logsCommented} log${logsCommented === 1 ? '' : 's'} commented`);
  }

  return parts.join(', ');
}
