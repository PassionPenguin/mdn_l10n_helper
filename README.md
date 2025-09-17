# MDN Localization Helpe# Clone and Setup Repositories

A web application that enhances the localization and review process of MDN Web Docs, making web learning more accessible, easy, and fun!

```bash
# Clone the main repositories
git clone https://github.com/mdn/translated-content.git
git clone https://github.com/mdn/content.git

# Clone this helper tool
git clone https://github.com/PassionPenguin/mdn_l10n_helper.git
cd mdn_l10n_helper
```

## 🚀 Features

- **Review Interface**: Compare source and translated content side-by-side with syntax highlighting
- **Change Detection**: Automatically detect pending translation changes from git
- **Diff Visualization**: Clean, readable diff display with markdown processing support
- **Metadata Parsing**: Extract and display title, slug, and commit information
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Built-in theme support with system preference detection

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **yarn** package manager (recommended)
- **Git** for repository operations
- **Rust** (v1.70 or higher) for the backend - [Install Rust](https://rustup.rs/)

## 🛠️ Quick Start

### 1. Clone and Setup Repositories

```bash
# Clone the main repositories
git clone https://github.com/mdn/translated-content.git
git clone https://github.com/mdn/content.git

# Clone this helper tool
git clone https://github.com/your-username/mdn_l10n_helper.git
cd mdn_l10n_helper
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Start the Backend

```bash
cd ../mdn_l10n_helper_backend

# Copy and configure environment
cp .env.example .env
# Edit .env to set correct paths

# Start the backend (this will also start the frontend)
cargo run
```

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal).

## 📖 Usage Guide

### Review Page

1. **Select Locale**: Choose your target language (e.g., `zh-cn`, `es`, `fr`)
2. **Browse Changes**: View the list of files with pending changes
3. **Compare Content**: Click on any file to see side-by-side comparison
4. **Review Metadata**: Check title, slug, and commit information
5. **Navigate**: Use keyboard shortcuts or click to move between files

### Compare Page

1. **Set Repository Details**: Configure owner, branch, path, and locale
2. **Fetch Content**: Load source and translation files from GitHub
3. **Visual Comparison**: Review differences with markdown processing
4. **Save/Load Sessions**: Persist your work locally

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_BACKEND_URL` | `http://localhost:3030` | Backend API base URL |
| `VITE_GITHUB_TOKEN` | - | GitHub personal access token (optional, for API rate limits) |

### Backend Configuration

The backend requires these environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `REPO_ROOT` | `../translated-content` | Path to translated-content repository |
| `SOURCE_REPO_ROOT` | `../content` | Path to content repository |
| `SOURCE_LOCALE` | `en-us` | Source language code |
| `BASE_REF` | `origin/main` | Git reference for comparison |
| `SERVER_PORT` | `3030` | Backend server port |

## 🔧 Development

### Project Structure

```
mdn_l10n_helper/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Main application pages
│   │   ├── compare/   # File comparison interface
│   │   └── review/    # Change review interface
│   ├── models/        # Data models and types
│   ├── utils/         # Utility functions
│   └── styles/        # Global styles and themes
├── public/            # Static assets
└── package.json       # Dependencies and scripts
```

### Available Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn preview      # Preview production build
yarn lint         # Run ESLint
yarn i18n         # Generate internationalization keys
```

### Key Technologies

- **React** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Markdown** - Markdown rendering

## 🔌 API Integration

### Backend Endpoints

The frontend communicates with the Rust backend via these endpoints:

- `GET /health` - Health check
- `GET /api/changes?locale=<locale>` - List changed files
- `GET /api/diff?locale=<locale>&path=<path>` - Get file diff and content

### Data Flow

1. **Frontend** requests change list from backend
2. **Backend** queries git for changed files
3. **Frontend** displays file list with metadata
4. **Frontend** requests specific file diff
5. **Backend** reads files and generates diff
6. **Frontend** renders side-by-side comparison

## 🐛 Troubleshooting

### Common Issues

**Backend Connection Failed**
```bash
# Check if backend is running
curl http://localhost:3030/health

# Verify environment variables
cat ../mdn_l10n_helper_backend/.env
```

**No Changes Detected**
```bash
# Ensure repositories are up to date
cd ../translated-content
git fetch origin main
git status

# Check git configuration
git config --list | grep -E "(user|remote)"
```

**Build Errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules yarn.lock
yarn install

# Check yarn version
yarn --version
```

**Performance Issues**
- Ensure repositories are on fast storage (SSD recommended)
- Use shallow clones for large repositories
- Configure git to use more memory for large diffs

### Debug Mode

Enable debug logging by setting:

```bash
export RUST_LOG=debug
export VITE_DEBUG=true
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Run the linter: `yarn lint`
5. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Add JSDoc comments for public APIs
- Write tests for new features

## 📚 Resources

- [MDN Web Docs](https://developer.mozilla.org/) - The main documentation site
- [MDN Content Repository](https://github.com/mdn/content) - Source English content
- [MDN Translated Content](https://github.com/mdn/translated-content) - Localized content
- [MDN Localization Guide](https://github.com/mdn/translated-content/blob/main/docs/README.md)

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](./LICENSE) file for details.


## Disclaimer

This project is not affiliated with the MDN project.

---

**Made with ❤️ for the web development community**
