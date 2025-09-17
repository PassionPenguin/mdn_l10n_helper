# Contributing to MDN Localization Helper

Thank you for your interest in contributing to the MDN Localization Helper! This document provides guidelines and information for contributors.

## 🚀 Ways to Contribute

- **🐛 Bug Reports**: Found a bug? [Open an issue](https://github.com/PassionPenguin/mdn_l10n_helper/issues) with detailed steps to reproduce
- **✨ Feature Requests**: Have an idea? [Create a feature request](https://github.com/PassionPenguin/mdn_l10n_helper/issues) with use case and benefits
- **💻 Code Contributions**: Fix bugs or add features through pull requests
- **📖 Documentation**: Improve documentation, add examples, or fix typos
- **🧪 Testing**: Add tests or help improve test coverage
- **🌐 Localization**: Help translate the tool itself or improve localization features

## 🛠️ Development Setup

See the [README.md](./README.md) for detailed setup instructions.

### Prerequisites

- Node.js v18+
- Rust v1.70+
- Git
- Local clones of MDN repositories

### Quick Setup

```bash
# Clone and setup
git clone https://github.com/PassionPenguin/mdn_l10n_helper.git
cd mdn_l10n_helper
yarn install

# Setup backend
cd ../mdn_l10n_helper_backend
cp .env.example .env
# Edit .env with your paths
cargo run
```

## 📝 Development Workflow

### 1. Choose an Issue

- Check [open issues](https://github.com/PassionPenguin/mdn_l10n_helper/issues) for tasks
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to indicate you're working on it

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 3. Make Changes

- Write clear, concise commit messages
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes

```bash
# Frontend
npm run lint
npm run build

# Backend
cargo test
cargo clippy
cargo fmt
```

### 5. Submit a Pull Request

- Push your branch to your fork
- Create a pull request with a clear description
- Reference any related issues
- Wait for review and address feedback

## 💻 Code Guidelines

### Frontend (TypeScript/React)

- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Use functional components with hooks
- Add JSDoc comments for public APIs
- Follow the existing naming conventions
- Keep components small and focused

### Backend (Rust)

- Follow Rust idioms and best practices
- Add documentation comments for public APIs
- Use meaningful variable and function names
- Handle errors gracefully
- Write comprehensive tests

### General

- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Update documentation for any user-facing changes
- Add tests for new features and bug fixes

## 🧪 Testing

### Frontend Testing

```bash
# Run linting
yarn lint

# Build to check for TypeScript errors
yarn build

# Manual testing
yarn dev
```

### Backend Testing

```bash
# Run all tests
cargo test

# Run with verbose output
cargo test --verbose

# Run specific test
cargo test test_name

# Check code quality
cargo clippy
cargo fmt --check
```

## 📚 Documentation

- Update README.md for any user-facing changes
- Add JSDoc comments for new functions
- Update API documentation for endpoint changes
- Add examples for new features

## 🎯 Commit Message Guidelines

Use clear, descriptive commit messages:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(review): add side-by-side diff view
fix(api): handle missing source files gracefully
docs(readme): update installation instructions
```

## 🤝 Code Review Process

1. **Automated Checks**: CI will run tests and linting
2. **Peer Review**: At least one maintainer will review your PR
3. **Feedback**: Address any requested changes
4. **Approval**: PR will be merged once approved

## 📞 Getting Help

- **Issues**: [GitHub Issues](https://github.com/PassionPenguin/mdn_l10n_helper/issues)
- **Discussions**: [GitHub Discussions](https://github.com/PassionPenguin/mdn_l10n_helper/discussions)
- **Documentation**: Check the [README.md](./README.md) and [API docs](./docs/api.md)

## 📋 Pull Request Checklist

- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] PR description explains the changes
- [ ] Related issues are referenced

## 🙏 Recognition

Contributors will be recognized in:
- The repository's contributor list
- Release notes for significant contributions
- Special mentions for major features

Thank you for contributing to making MDN more accessible worldwide! 🌍