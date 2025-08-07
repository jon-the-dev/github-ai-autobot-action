# GitHub AI Autobot Action v2 🤖

> **An intelligent, enterprise-grade code review automation tool powered by OpenAI GPT and Anthropic Claude**

[![GitHub Release](https://img.shields.io/github/v/release/jon-the-dev/github-ai-autobot-action)](https://github.com/jon-the-dev/github-ai-autobot-action/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/jon-the-dev/github-ai-autobot-action)](https://github.com/jon-the-dev/github-ai-autobot-action/issues)

**GitHub AI Autobot Action v2** is a significant evolution of the original [ai-codereviewer](https://github.com/villesau/ai-codereviewer) project by [Ville Saukkonen](https://github.com/villesau). This v2 represents a complete architectural overhaul with enhanced security, scalability, and enterprise-grade features designed for modern DevSecOps workflows.

## 🎯 What's New in v2

- **🔧 Enhanced Architecture**: Completely redesigned with modern TypeScript patterns
- **🔒 Security First**: Built with security and compliance in mind
- **⚡ Performance Optimized**: Faster processing with improved error handling
- **🛡️ Enterprise Ready**: Designed for scale with proper logging and monitoring
- **🚀 Modern UX**: Enhanced user experience with better feedback and status indicators
- **🔍 Advanced Analysis**: Improved code analysis with focus on security, performance, and best practices
- **📊 Better Reporting**: Enhanced comment formatting and review insights

## 🌟 Features

### Multi-Provider AI Support
- **OpenAI Models**: GPT-4, GPT-4o, GPT-4-turbo, GPT-3.5-turbo, o1, o1-mini
- **Anthropic Claude**: Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus, Claude 3 Haiku
- **Auto-Detection**: Automatically selects provider based on model name
- **Dual Provider Support**: Use multiple models simultaneously with matrix strategy

### Advanced Code Analysis
- **Security Vulnerability Detection**: Identifies potential security issues
- **Performance Analysis**: Spots performance bottlenecks and optimization opportunities
- **Code Quality Assessment**: Evaluates adherence to best practices
- **Bug Prevention**: Catches potential runtime errors and logical issues

### Enterprise Features
- **Flexible File Filtering**: Advanced glob pattern support for excluding files
- **Comprehensive Logging**: Detailed debug information for troubleshooting
- **Error Resilience**: Robust error handling with graceful degradation
- **Configuration Validation**: Early validation of API keys and settings

## 🚀 Quick Start

### 1. Prerequisites

- GitHub repository with Actions enabled
- API key from one or both providers:
  - **OpenAI**: [Get API Key](https://platform.openai.com/signup)
  - **Anthropic**: [Get API Key](https://console.anthropic.com/)

### 2. Add Secrets

Add your API keys as GitHub Secrets:
- `OPENAI_API_KEY` (for GPT models)
- `CLAUDE_API_KEY` (for Claude models)

### 3. Create Workflow

Create `.github/workflows/ai-autobot-review.yml`:

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

permissions: write-all

jobs:
  ai_review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: AI Code Review
        uses: jon-the-dev/github-ai-autobot-action@v2
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          AI_MODEL: "gpt-4o"
          exclude: "*.json,*.md,dist/**"
```

## ⚙️ Configuration

### Input Parameters

| Parameter | Description | Required | Default |
|-----------|-------------|----------|---------|
| `GITHUB_TOKEN` | GitHub token for repository access | ✅ Yes | - |
| `OPENAI_API_KEY` | OpenAI API key | Conditional* | - |
| `CLAUDE_API_KEY` | Anthropic Claude API key | Conditional* | - |
| `AI_MODEL` | AI model to use | No | `gpt-4o` |
| `AI_PROVIDER` | Provider: `openai`, `claude`, or `auto` | No | `auto` |
| `exclude` | Glob patterns for file exclusion | No | `""` |

*At least one API key is required

### Supported Models

#### 🤖 OpenAI Models
- `gpt-4o` - Latest GPT-4 Optimized (Recommended)
- `gpt-4` - GPT-4 (High capability)
- `gpt-4-turbo` - GPT-4 Turbo (Fast and capable)
- `gpt-3.5-turbo` - Most cost-effective
- `o1` - Advanced reasoning model
- `o1-mini` - Compact reasoning model

#### 🧠 Anthropic Claude Models
- `claude-3.5-sonnet` - Latest and most capable (Recommended)
- `claude-3.5-haiku` - Fast and efficient
- `claude-3-opus` - Very capable, thorough analysis
- `claude-3-haiku` - Fastest option

## 🔧 Development & Contributing

### Local Development

```bash
# Clone the repository
git clone https://github.com/jon-the-dev/github-ai-autobot-action.git
cd github-ai-autobot-action

# Install dependencies
npm install

# Build TypeScript
npm run build

# Package for distribution
npm run package
```

## 🤝 Attribution & License

This project is a significant evolution of the original [ai-codereviewer](https://github.com/villesau/ai-codereviewer) by [Ville Saukkonen](https://github.com/villesau), originally released under MIT License.

### Original Attribution
- **Original Author**: Ville Saukkonen ([@villesau](https://github.com/villesau))
- **Original Project**: [ai-codereviewer](https://github.com/villesau/ai-codereviewer)
- **Original License**: MIT License (2023)

### v2 Evolution
- **v2 Author**: Jon Price ([@jon-the-dev](https://github.com/jon-the-dev))
- **v2 Enhancements**: Complete architectural redesign, security improvements, enterprise features
- **v2 License**: MIT License (2025) - includes original attribution

Both original and modified works are released under the MIT License. See [LICENSE](LICENSE) for full details.

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/jon-the-dev/github-ai-autobot-action/issues)
- **Author**: [Jon Price](https://linkedin.com/in/jonpricelinux) - Cloud Architect & DevSecOps Specialist
- **Company**: [Tier1 Development](https://tier1dev.com) - Cloud-native solutions

---

**Made with ❤️ by [Jon Price](https://github.com/jon-the-dev) | Evolved from the excellent work by [Ville Saukkonen](https://github.com/villesau)**
