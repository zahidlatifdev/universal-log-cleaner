/**
 * Canonical regex pattern builders for detecting logs across languages
 * These patterns are designed to be robust and handle common edge cases
 */

/**
 * Build regex for JavaScript/TypeScript console methods
 * Handles: console.log, console.error, console.warn, etc.
 * Handles multi-line calls and template literals
 * @param methods Optional array of specific methods to match
 */
export function buildJSConsolePattern(methods?: string[]): RegExp {
  const defaultMethods = [
    'log',
    'debug',
    'info',
    'warn',
    'error',
    'trace',
    'dir',
    'dirxml',
    'table',
    'group',
    'groupCollapsed',
    'groupEnd',
    'time',
    'timeEnd',
    'timeLog',
    'assert',
    'count',
    'countReset',
    'profile',
    'profileEnd',
    'clear',
  ];
  const methodsToMatch = methods && methods.length > 0 ? methods : defaultMethods;
  const methodsPattern = methodsToMatch.join('|');
  return new RegExp(`console\\.(${methodsPattern})\\s*\\([^)]*\\)\\s*;?`, 'gs');
}

/**
 * Build regex for Python print statements
 * Handles: print(), print(f"..."), print("...", end="")
 */
export function buildPythonPrintPattern(): RegExp {
  return /print\s*\([^)]*\)/g;
}

/**
 * Build regex for Java System.out/err
 * Handles: System.out.println, System.err.println
 */
export function buildJavaSystemOutPattern(): RegExp {
  return /System\.(out|err)\.(print|println|printf)\s*\([^)]*\)\s*;?/gs;
}

/**
 * Build regex for PHP echo, print, var_dump
 */
export function buildPHPEchoPattern(): RegExp {
  return /(echo|print|var_dump|print_r|var_export)\s*[()\s][^;]+;?/g;
}

/**
 * Build regex for C# Console.WriteLine
 */
export function buildCSharpConsolePattern(): RegExp {
  return /Console\.(Write|WriteLine|Error|Out)\s*\([^)]*\)\s*;?/gs;
}

/**
 * Build regex for Go fmt.Print functions
 */
export function buildGoFmtPattern(): RegExp {
  return /fmt\.(Print|Printf|Println|Fprint|Fprintf|Fprintln|Sprint|Sprintf|Sprintln)\s*\([^)]*\)/gs;
}

/**
 * Build regex for Rust println!, print!, dbg!
 */
export function buildRustPrintPattern(): RegExp {
  return /(println!|print!|dbg!|eprintln!|eprint!)\s*\([^)]*\)/gs;
}

/**
 * Build regex for Swift print
 */
export function buildSwiftPrintPattern(): RegExp {
  return /print\s*\([^)]*\)/g;
}

/**
 * Build regex for C/C++ printf, cout
 */
export function buildCPrintfPattern(): RegExp {
  return /(printf|fprintf|sprintf|snprintf)\s*\([^)]*\)\s*;?/gs;
}

export function buildCppCoutPattern(): RegExp {
  return /(std::)?cout\s*<<[^;]+;?/g;
}

/**
 * Build regex for Ruby puts, print, p
 */
export function buildRubyPutsPattern(): RegExp {
  return /(puts|print|p)\s+[^\n]+/g;
}

/**
 * Build regex for Dart print
 */
export function buildDartPrintPattern(): RegExp {
  return /print\s*\([^)]*\)/g;
}

/**
 * Build regex for Shell echo
 */
export function buildShellEchoPattern(): RegExp {
  return /echo\s+[^\n]+/g;
}

/**
 * Build regex for SQL PRINT, RAISERROR
 */
export function buildSQLPrintPattern(): RegExp {
  return /(PRINT|RAISERROR)\s+[^\n]+/gi;
}

/**
 * Build regex for HTML inline console in script tags
 */
export function buildHTMLConsolePattern(): RegExp {
  return /console\.(log|debug|info|warn|error)\s*\([^)]*\)\s*;?/gs;
}

/**
 * Build regex for single-line comments containing logs
 * @param commentPrefix Comment prefix (e.g., '//', '#', '--')
 */
export function buildCommentedLogPattern(commentPrefix: string): RegExp {
  const escapedPrefix = commentPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(
    `${escapedPrefix}\\s*(console\\.|print\\(|System\\.out|echo|fmt\\.|println!|cout).*$`,
    'gm'
  );
}

/**
 * Build regex for multi-line block comments containing logs
 * @param startToken Start token (e.g., slash-star)
 * @param endToken End token (e.g., star-slash)
 */
export function buildBlockCommentedLogPattern(startToken: string, endToken: string): RegExp {
  const escapedStart = startToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedEnd = endToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(
    `${escapedStart}[\\s\\S]*?(console\\.|print\\(|System\\.out|echo|fmt\\.|println!|cout)[\\s\\S]*?${escapedEnd}`,
    'g'
  );
}

/**
 * Build regex for debugger statements
 */
export function buildDebuggerPattern(): RegExp {
  return /debugger\s*;?/g;
}

/**
 * Escape regex special characters in a string
 * @param str String to escape
 * @returns Escaped string
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
