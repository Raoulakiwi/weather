# Command Reference - Weather Aggregator

Quick reference for all available commands and scripts.

## 📦 Package Management

### Install Dependencies
```bash
npm install
```
Installs all project dependencies from package.json.

### Update Dependencies
```bash
# Check for outdated packages
npm outdated

# Update all packages (minor/patch)
npm update

# Update to latest versions (including major)
npx npm-check-updates -u
npm install
```

### Add New Package
```bash
# Production dependency
npm install <package-name>

# Development dependency
npm install -D <package-name>
```

### Remove Package
```bash
npm uninstall <package-name>
```

---

## 🛠️ Development

### Start Development Server
```bash
npm run dev
```
- Starts Vite dev server
- Opens at http://localhost:3000
- Hot module replacement enabled
- Fast refresh for React components

### Start on Different Port
```bash
npm run dev -- --port 3001
```

### Build for Production
```bash
npm run build
```
- Compiles TypeScript
- Builds optimized production bundle
- Output to `dist/` directory
- Minifies and tree-shakes code

### Preview Production Build
```bash
npm run preview
```
- Serves production build locally
- Test before deploying
- Opens at http://localhost:4173

### Run Linter
```bash
npm run lint
```
- Checks code with ESLint
- Reports errors and warnings
- Enforces code style

---

## 🚀 Deployment

### Deploy to Vercel

#### First Time Setup
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel
```

#### Deploy to Production
```bash
vercel --prod
```

#### Deploy Preview
```bash
vercel
```

#### Add Environment Variable
```bash
vercel env add OPENWEATHER_API_KEY
```

#### List Environment Variables
```bash
vercel env ls
```

#### Remove Environment Variable
```bash
vercel env rm OPENWEATHER_API_KEY
```

### Deploy to Netlify

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

## 🧹 Maintenance

### Clean Node Modules
```bash
# Remove node_modules
rm -rf node_modules

# Remove package-lock.json
rm package-lock.json

# Reinstall
npm install
```

### Clean Build Artifacts
```bash
# Remove dist folder
rm -rf dist

# Remove Vercel cache
rm -rf .vercel
```

### Clear NPM Cache
```bash
npm cache clean --force
```

---

## 🔍 Testing & Debugging

### Check TypeScript Types
```bash
# Check for type errors
npx tsc --noEmit
```

### Check Bundle Size
```bash
# After build
npm run build

# Analyze bundle
npx vite-bundle-visualizer
```

### Security Audit
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

---

## 🌐 Environment Management

### Create Environment File
```bash
cp .env.example .env
```

### Edit Environment Variables
```bash
# On Unix/Mac
nano .env

# On Windows
notepad .env
```

### Load Environment Variables (for testing)
```bash
# Unix/Mac
export $(cat .env | xargs)

# Windows PowerShell
Get-Content .env | ForEach-Object {
    $name, $value = $_.split('=')
    Set-Content env:\$name $value
}
```

---

## 📊 Git Commands

### Initialize Repository
```bash
git init
git add .
git commit -m "Initial commit"
```

### Create New Branch
```bash
git checkout -b feature/new-feature
```

### Push to GitHub
```bash
# First time
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main

# Subsequent pushes
git push
```

### Create Tag/Release
```bash
git tag v1.0.0
git push --tags
```

---

## 🧪 Advanced Commands

### Run TypeScript Compiler Watch Mode
```bash
npx tsc --watch
```

### Format Code with Prettier (if installed)
```bash
npx prettier --write "src/**/*.{ts,tsx}"
```

### Generate Component Template (custom script)
```bash
# Create new component
npx hygen component new MyComponent
```

### Analyze Code Complexity
```bash
npx madge --circular src
```

### Check for Unused Dependencies
```bash
npx depcheck
```

---

## 🔧 Troubleshooting Commands

### Fix Node Version Issues
```bash
# Check Node version
node --version

# Check NPM version
npm --version

# Use specific Node version (with nvm)
nvm use 18
```

### Fix Port Already in Use
```bash
# Find process on port 3000
# Unix/Mac:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Fix Permission Errors
```bash
# Unix/Mac
sudo chown -R $USER ~/.npm
sudo chown -R $USER node_modules

# Or use npx instead of global installs
npx <command>
```

### Fix Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force
npm install
```

---

## 📱 Mobile Development Commands

### Test on Mobile Device
```bash
# Start dev server with network access
npm run dev -- --host

# Your app will be available at:
# http://<your-ip>:3000
```

### Generate PWA (if implementing)
```bash
npm run build
npx vite-plugin-pwa
```

---

## 🎨 UI Development Commands

### Tailwind CSS IntelliSense
```bash
# Install VS Code extension
code --install-extension bradlc.vscode-tailwindcss
```

### View Tailwind Config
```bash
npx tailwindcss config
```

### Generate Tailwind Types (if needed)
```bash
npx tailwindcss-types
```

---

## 📚 Documentation Commands

### Generate TypeDoc (if implementing)
```bash
npx typedoc --out docs src
```

### Serve Documentation
```bash
npx serve docs
```

---

## 🔒 Security Commands

### Update Security Vulnerabilities
```bash
npm audit fix
```

### Check for Outdated Security Advisories
```bash
npm audit
```

### Scan for Secrets (using git-secrets)
```bash
git secrets --scan
```

---

## 💻 IDE Commands

### Open in VS Code
```bash
code .
```

### Open Specific File
```bash
code src/App.tsx
```

---

## 🌍 Localization Commands (if implementing)

### Extract Translation Strings
```bash
npx i18next-scanner
```

---

## 🚦 Pre-commit Checks (recommended)

### Run All Checks
```bash
npm run lint && npm run build
```

### Install Husky (git hooks)
```bash
npx husky-init
npm install
```

---

## 📦 Useful One-Liners

### Count Lines of Code
```bash
# Unix/Mac
find src -name '*.tsx' -o -name '*.ts' | xargs wc -l

# Windows PowerShell
Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx | Get-Content | Measure-Object -Line
```

### List All Components
```bash
ls src/components/
```

### Search for TODO Comments
```bash
grep -r "TODO" src/
```

### Find Large Files
```bash
find . -type f -size +1M
```

---

## 🎯 Quick Aliases (add to ~/.bashrc or ~/.zshrc)

```bash
# Development
alias dev="npm run dev"
alias build="npm run build"
alias preview="npm run preview"

# Git
alias gs="git status"
alias ga="git add ."
alias gc="git commit -m"
alias gp="git push"

# Weather App Specific
alias weather-dev="cd ~/projects/weather && npm run dev"
alias weather-deploy="cd ~/projects/weather && vercel --prod"
```

---

## 📊 Performance Commands

### Lighthouse Audit
```bash
# After starting dev server
npx lighthouse http://localhost:3000 --view
```

### Bundle Analysis
```bash
npm run build
npx vite-bundle-visualizer
```

---

## 🔄 CI/CD Commands (for GitHub Actions)

### Validate Build
```bash
npm ci
npm run build
```

### Run All Checks
```bash
npm ci
npm run lint
npm run build
```

---

## 💡 Tips

- Use `npx` instead of global installs when possible
- Add frequently used commands as npm scripts in package.json
- Use shell aliases for common tasks
- Keep dependencies updated regularly
- Run `npm audit` weekly

---

**Quick Command Summary**:
```bash
npm install          # Install dependencies
npm run dev          # Start development
npm run build        # Build for production
npm run preview      # Preview production build
vercel --prod        # Deploy to production
```

---

Happy coding! 🚀

