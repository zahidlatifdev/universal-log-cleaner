/**
 * Core type definitions for Universal Log Cleaner
 */

/**
 * Detector pattern definition - represents a single log or comment pattern to detect
 */
export interface DetectorPattern {
  /** Regular expression to match the pattern */
  pattern: RegExp;
  /** Human-readable description of what this pattern matches */
  description: string;
  /** Pattern type: single-line or multi-line */
  mode: 'singleLine' | 'multiLine';
  /** Priority for pattern matching (higher = checked first) */
  priority?: number;
  /** Whether this pattern should be skipped if whitelist tags are present */
  respectWhitelist?: boolean;
}

/**
 * Language detector interface - each language implements this
 */
export interface IDetector {
  /** Language identifiers this detector supports */
  languageIds: string[];
  /** File extensions this detector supports */
  fileExtensions: string[];
  /** Build patterns based on current configuration */
  buildPatterns(config: CleanerConfig): DetectorPattern[];
}

/**
 * Extension configuration - maps to VS Code settings
 */
export interface CleanerConfig {
  /** Languages to process */
  languages: string[];
  /** Cleaning mode: delete, comment, or preview */
  mode: 'delete' | 'comment' | 'preview';
  /** Remove logs that are already commented */
  removeCommentedLogs: boolean;
  /** Maximum file size in KB */
  maxFileSizeKB: number;
  /** Tags that prevent log removal */
  whitelistTags: string[];
  /** Exclusion patterns */
  exclude: string[];
  /** Always dry-run first */
  dryRunDefault: boolean;
  /** Enable HTML/CSS special handling */
  htmlCssHandling: boolean;
  /** Selective log types to remove */
  logTypes: LogTypesConfig;
}

/**
 * Selective log type configuration per language
 */
export interface LogTypesConfig {
  /** JavaScript/TypeScript console methods */
  javascript: {
    log: boolean;
    debug: boolean;
    info: boolean;
    warn: boolean;
    error: boolean;
    trace: boolean;
    table: boolean;
    dir: boolean;
    assert: boolean;
    count: boolean;
    group: boolean;
    time: boolean;
  };
  /** Debugger statements */
  debugger: boolean;
  /** Generic - for other languages (all or none) */
  allOtherLogs: boolean;
}

/**
 * Match result - represents a detected log statement
 */
export interface MatchResult {
  /** Matched text */
  text: string;
  /** Start line number (0-indexed) */
  startLine: number;
  /** End line number (0-indexed) */
  endLine: number;
  /** Start character position in start line */
  startChar: number;
  /** End character position in end line */
  endChar: number;
  /** Pattern that matched */
  pattern: DetectorPattern;
  /** Whether this match should be kept (whitelist check) */
  shouldKeep: boolean;
}

/**
 * File cleaning result
 */
export interface FileCleanResult {
  /** File path */
  filePath: string;
  /** Original content */
  originalContent: string;
  /** New content after cleaning */
  newContent: string;
  /** Matches found */
  matches: MatchResult[];
  /** Number of logs removed */
  logsRemoved: number;
  /** Number of logs commented */
  logsCommented: number;
  /** Whether file was modified */
  modified: boolean;
  /** Any errors encountered */
  error?: string;
}

/**
 * Workspace cleaning result
 */
export interface WorkspaceCleanResult {
  /** Results per file */
  fileResults: FileCleanResult[];
  /** Total logs removed */
  totalLogsRemoved: number;
  /** Total logs commented */
  totalLogsCommented: number;
  /** Total files modified */
  totalFilesModified: number;
  /** Execution time in milliseconds */
  executionTimeMs: number;
}

/**
 * Undo state - stores information needed to undo last clean
 */
export interface UndoState {
  /** Timestamp of operation */
  timestamp: number;
  /** Files modified and their original content */
  files: Array<{
    filePath: string;
    originalContent: string;
  }>;
  /** Summary message */
  summary: string;
}
