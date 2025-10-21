# Universal Log Cleaner

[![CI](https://github.com/zahidlatifdev/universal-log-cleaner/workflows/CI/badge.svg)](https://github.com/zahidlatifdev/universal-log-cleaner/actions)
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/zahidlatifdev.universal-log-cleaner?label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=zahidlatifdev.universal-log-cleaner)
[![OpenVSX](https://img.shields.io/open-vsx/v/zahidlatifdev/universal-log-cleaner?label=OpenVSX)](https://open-vsx.org/extension/zahidlatifdev/universal-log-cleaner)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/zahidlatifdev.universal-log-cleaner)](https://marketplace.visualstudio.com/items?itemName=zahidlatifdev.universal-log-cleaner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Privacy-first, offline-only, multi-language log and comment cleaner for VS Code**

Universal Log Cleaner is a powerful VS Code extension that automatically detects and removes logging statements and debug comments across 20+ programming languages. It operates entirely offline with no telemetry, ensuring your code never leaves your machine.

## ✨ Features

- 🔒 **100% Privacy** - No telemetry, no tracking, no external network calls
- 🌐 **Multi-Language Support** - Works with 20+ languages including:
  - JavaScript/TypeScript, Python, Java, PHP, C#
  - Go, Rust, Swift, C/C++, Ruby, Dart
  - Shell, SQL, HTML, CSS/SCSS/Less, Markdown
- 🔍 **Smart Detection** - Finds single-line and multi-line log statements
- 🛡️ **Whitelist Support** - Use `@keep` or `@preserve` tags to protect important logs
- 👁️ **Preview Mode** - Dry-run with diff preview before applying changes
- ⏪ **Single-Level Undo** - Restore files if needed
- ⚙️ **Flexible Configuration** - Delete, comment-out, or preview modes
- 🎯 **Workspace & File Scopes** - Clean individual files or entire workspace

## 📦 Installation

### From VS Code Marketplace (Recommended)

**For VS Code:**

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "Universal Log Cleaner"
4. Click Install

Or install directly: [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=zahidlatifdev.universal-log-cleaner)

### From OpenVSX (For VS Code Forks)

**For VS Codium, Code-OSS, Gitpod, Eclipse Theia:**

Install from: [OpenVSX Registry](https://open-vsx.org/extension/zahidlatifdev/universal-log-cleaner)

### From VSIX (Manual Installation)

1. Download the latest `.vsix` file from [Releases](https://github.com/zahidlatifdev/universal-log-cleaner/releases)
2. Install via command line:
   ```bash
   code --install-extension universal-log-cleaner-1.0.0.vsix
   ```
3. Or install via VS Code:
   - Open Extensions view (`Ctrl+Shift+X`)
   - Click `...` menu → "Install from VSIX..."
   - Select the downloaded `.vsix` file

### From Source

```bash
git clone https://github.com/zahidlatifdev/universal-log-cleaner.git
cd universal-log-cleaner
npm install
npm run build
npm run package
code --install-extension dist/universal-log-cleaner-1.0.0.vsix
```

## ⚡ Quick Start

```bash
# 1. Install the extension
code --install-extension dist/universal-log-cleaner-1.0.0.vsix

# 2. Create a test file
echo "console.log('test'); console.warn('warn');" > test.js

# 3. Open in VS Code and press Ctrl+Alt+L (Cmd+Alt+L on Mac)
# 4. Review preview and apply changes
```

### Configure Selective Removal

Only remove `console.log` but keep warnings/errors:

```json
{
  "universalLogCleaner.logTypes": {
    "javascript": {
      "log": true,
      "warn": false,
      "error": false
    }
  }
}
```

## 🚀 Usage

### Commands

Access commands via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- **Universal Log Cleaner: Clean Workspace** - Clean all files in workspace
- **Universal Log Cleaner: Clean Current File** - Clean active file
- **Universal Log Cleaner: Preview** - Preview changes without applying (default: `Ctrl+Alt+L`)
- **Universal Log Cleaner: Undo** - Restore last changes
- **Universal Log Cleaner: Open Settings** - Open extension settings

### Keyboard Shortcuts

- `Ctrl+Alt+L` (Windows/Linux) or `Cmd+Alt+L` (Mac) - Preview & Clean File

### Status Bar

The status bar shows extension state:

- `ULC: Ready` - Extension is active
- `ULC: X file(s)` - Shows summary after cleaning

## ⚙️ Configuration

Configure via VS Code settings (`File` > `Preferences` > `Settings` > search "Universal Log Cleaner"):

| Setting                                   | Type    | Default                  | Description                                      |
| ----------------------------------------- | ------- | ------------------------ | ------------------------------------------------ |
| `universalLogCleaner.languages`           | array   | `[...]`                  | Languages to process                             |
| `universalLogCleaner.mode`                | string  | `preview`                | Cleaning mode: `delete`, `comment`, or `preview` |
| `universalLogCleaner.removeCommentedLogs` | boolean | `true`                   | Remove logs that are already commented           |
| `universalLogCleaner.maxFileSizeKB`       | number  | `500`                    | Maximum file size to process (KB)                |
| `universalLogCleaner.whitelistTags`       | array   | `["@keep", "@preserve"]` | Tags that prevent log removal                    |
| `universalLogCleaner.exclude`             | array   | `[...]`                  | Glob patterns to exclude                         |
| `universalLogCleaner.dryRunDefault`       | boolean | `true`                   | Always dry-run first                             |
| `universalLogCleaner.htmlCssHandling`     | boolean | `true`                   | Enable HTML/CSS special handling                 |

### Example Configuration

```json
{
  "universalLogCleaner.mode": "delete",
  "universalLogCleaner.whitelistTags": ["@keep", "@preserve", "@important"],
  "universalLogCleaner.exclude": ["**/node_modules/**", "**/dist/**", "**/test/**"]
}
```

## 🏷️ Whitelist Tags

Protect specific log statements from removal using special tags:

```javascript
// @keep
console.log('This will NOT be removed');

// @preserve - Important for debugging
console.log('Also protected');

console.log('This WILL be removed');
```

## 🔍 Supported Languages & Patterns

| Language              | Detected Patterns                      |
| --------------------- | -------------------------------------- |
| JavaScript/TypeScript | `console.*`, `debugger`                |
| Python                | `print()`                              |
| Java                  | `System.out.*`, `System.err.*`         |
| PHP                   | `echo`, `print`, `var_dump`, `print_r` |
| C#                    | `Console.Write*`                       |
| Go                    | `fmt.Print*`                           |
| Rust                  | `println!`, `print!`, `dbg!`           |
| Swift                 | `print()`                              |
| C/C++                 | `printf`, `fprintf`, `cout <<`         |
| Ruby                  | `puts`, `print`, `p`                   |
| Dart                  | `print()`                              |
| Shell                 | `echo`                                 |
| SQL                   | `PRINT`, `RAISERROR`                   |
| HTML                  | `console.*` in `<script>`, comments    |
| CSS/SCSS/Less         | Block and line comments (configurable) |
| Markdown              | HTML comments                          |

## 🧪 Testing

### Quick Test

```bash
npm run build && npm test && npm run lint
```

### Manual Testing

1. Install locally: `code --install-extension dist/universal-log-cleaner-1.0.0.vsix`
2. Create test file with logs
3. Press `Ctrl+Alt+L` to preview
4. Test selective log types in settings
5. Verify whitelist tags work (`@keep`, `@preserve`)
6. Test undo functionality

### Before Publishing

- [ ] All tests pass
- [ ] Tested with real projects
- [ ] Verified all console methods work (log, warn, error, etc.)
- [ ] Tested multiple languages
- [ ] No errors in VS Code Developer Tools

## 🛠️ Development

```bash
# Setup
git clone https://github.com/zahidlatifdev/universal-log-cleaner.git
cd universal-log-cleaner
npm install
npm run build

# Run extension (F5 in VS Code)
# Run tests
npm test

# Lint & format
npm run lint
npm run lint:fix

# Package
npm run package
```

## 🧩 Adding a New Language Detector

1. Create `src/detectors/<language>.ts`:

```typescript
import { IDetector, DetectorPattern, CleanerConfig } from '../types';

export class MyLanguageDetector implements IDetector {
  languageIds = ['mylang'];
  fileExtensions = ['.ml'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    return [
      {
        pattern: /mylog\([^)]*\)/g,
        description: 'MyLang log statements',
        mode: 'singleLine',
        priority: 10,
        respectWhitelist: true,
      },
    ];
  }
}
```

2. Register in `src/detectors/registry.ts`
3. Add tests in `test/detectors`
4. Update documentation

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## 📖 Documentation

- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute and release
- [SECURITY.md](SECURITY.md) - Report vulnerabilities
- [CHANGELOG.md](CHANGELOG.md) - Version history

## 🔐 Security & Privacy

- ✅ No telemetry or analytics
- ✅ No network calls at runtime
- ✅ No data collection
- ✅ No remote code execution
- ✅ 100% offline operation
- ✅ Source code never leaves your machine

See [SECURITY.md](SECURITY.md) for vulnerability reporting.

## 📝 License

[MIT License](LICENSE) © 2025 Universal Log Cleaner Contributors

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🐛 Issues & Support

- [Report bugs or request features](https://github.com/zahidlatifdev/universal-log-cleaner/issues)
- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=zahidlatifdev.universal-log-cleaner)
- [OpenVSX Registry](https://open-vsx.org/extension/zahidlatifdev/universal-log-cleaner)

## 🌟 Acknowledgments

Built with ❤️ using TypeScript and the VS Code Extension API.
