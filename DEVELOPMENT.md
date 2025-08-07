# Development Guide - GitHub AI Autobot Action v2

## 🛠️ Development Setup

### Prerequisites
- **Node.js** 20+ (recommended: use nvm)
- **Yarn** package manager  
- **Git** version control
- **GitHub CLI** (optional but recommended)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/jon-the-dev/github-ai-autobot-action.git
cd github-ai-autobot-action

# Install dependencies
yarn install

# Build TypeScript
yarn build

# Package for distribution (required for GitHub Actions)
yarn package

# Format code
yarn format

# Lint code  
yarn lint
```

## 🏗️ Project Structure

```
├── src/
│   ├── main.ts              # Main entry point
│   └── providers/           # AI Provider implementations
│       ├── types.ts         # TypeScript interfaces
│       ├── factory.ts       # Provider factory pattern
│       ├── openai.ts        # OpenAI GPT provider
│       └── claude.ts        # Anthropic Claude provider
├── dist/                    # Compiled JavaScript (committed to repo)
├── .github/
│   ├── workflows/           # GitHub Actions workflows
│   └── dependabot.yml       # Dependency updates
├── action.yml              # GitHub Action metadata
├── package.json            # Node.js dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # Documentation
```

## 🔧 Key Files Explained

### `src/main.ts`
The main entry point that:
- Handles GitHub Action inputs
- Processes PR diffs  
- Orchestrates AI providers
- Posts review comments

### `src/providers/`
Modular AI provider system:
- **Factory Pattern**: Auto-detects providers
- **Type Safety**: Strong TypeScript interfaces  
- **Extensible**: Easy to add new providers
- **Error Handling**: Robust error management

### `action.yml`
GitHub Action metadata defining:
- Input parameters
- Execution environment (Node.js 20)
- Branding (icon, color)

### `dist/`
**Critical**: Contains packaged JavaScript that GitHub Actions executes. Must be committed to repository.

## 🚀 Release Process

### 1. Version Preparation
```bash
# Update version in package.json
# Update README.md with new features
# Update CHANGELOG.md (if exists)
```

### 2. Build & Package
```bash
# Clean build
rm -rf lib dist
yarn build
yarn package
```

### 3. Commit Distribution
```bash
# Commit the built files (required for GitHub Actions)
git add dist/
git commit -m "📦 Update distribution for v2.x.x"
```

### 4. Create Release
```bash
# Tag the release
git tag v2.x.x
git push origin v2.x.x

# Or use GitHub CLI
gh release create v2.x.x --title "v2.x.x" --notes "Release notes here"
```

### 5. Update Major Version Tag
```bash
# Move the v2 tag to latest commit
git tag -fa v2 -m "v2.x.x"  
git push origin v2 --force
```

## 🔒 Security Considerations

### API Key Security
- **Never commit** API keys to repository
- Use GitHub Secrets for sensitive data
- Validate inputs early
- Handle errors without exposing secrets

### Input Validation
```typescript
// Example validation
if (!GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN is required");
}

if (!OPENAI_API_KEY && !CLAUDE_API_KEY) {
  throw new Error("At least one AI provider API key is required");
}
```

## 🤝 Contributing

### Pull Request Process
1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes following code standards
4. Build and package: `yarn build && yarn package`
5. Commit with conventional commits
6. Push and create Pull Request

---

**Questions or need help?**
- 📧 Email: [jon@tier1dev.com](mailto:jon@tier1dev.com)
- 🐙 GitHub: [@jon-the-dev](https://github.com/jon-the-dev)
- 💼 LinkedIn: [Jon Price](https://linkedin.com/in/jonpricelinux)
