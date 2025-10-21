# Changelog

All notable changes to the Universal Log Cleaner extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial release preparation
- Multi-language log detection and removal
- Preview mode with diff generation
- Workspace and file-level cleaning
- Single-level undo functionality
- Whitelist tag support (@keep, @preserve)
- Configurable cleaning modes (delete, comment, preview)
- Status bar integration
- Telemetry guard test

### Security

- No telemetry or analytics
- 100% offline operation
- No external network calls at runtime

## [1.0.0] - 2025-10-22

### Added

- Support for 20+ programming languages:
  - JavaScript, TypeScript, Python, Java, PHP
  - C#, Go, Rust, Swift, C, C++
  - Ruby, Dart, Shell, SQL
  - HTML, CSS, SCSS, Less, Markdown
- Core cleaning engine with regex-based detection
- Command palette commands:
  - Clean Workspace
  - Clean Current File
  - Preview Changes
  - Undo Last Clean
  - Open Settings
- Keyboard shortcut: Ctrl+Alt+L for preview
- Configuration options:
  - Language selection
  - Cleaning modes
  - File size limits
  - Exclusion patterns
  - Whitelist tags
- Developer documentation
- Unit test suite with Jest
- Example files for testing
- CI/CD pipeline with GitHub Actions
- Pre-commit hooks with Husky
- ESLint and Prettier integration

### Security

- Automated telemetry guard test
- Privacy-first design with no data collection
- Offline-only operation

### Documentation

- Comprehensive README
- Contributing guide
- Security policy
- Release process documentation
- Code of Conduct

---

## Installation

- **VS Code Marketplace**: https://marketplace.visualstudio.com/items?itemName=zahidlatifdev.universal-log-cleaner
- **OpenVSX Registry**: https://open-vsx.org/extension/zahidlatifdev/universal-log-cleaner
- **GitHub Releases**: https://github.com/zahidlatifdev/universal-log-cleaner/releases

[Unreleased]: https://github.com/zahidlatifdev/universal-log-cleaner/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/zahidlatifdev/universal-log-cleaner/releases/tag/v1.0.0
