# Deployment Guide - Smart Task Manager Pro

## 🚀 GitHub Pages Deployment Steps

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `smarttask` (or your preferred name)
3. Choose Public or Private
4. **Don't** initialize with README, .gitignore, or license
5. Click "Create repository"

### Step 2: Add Remote and Push

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/smarttask.git

# Push all code to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)
4. Under **Source**, select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
5. Click **Save**

### Step 4: Update Base Path (if needed)

If your repository name is NOT `smarttask`, update `vite.config.ts`:

```typescript
base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',
```

Then rebuild and push:
```bash
npm run build
git add .
git commit -m "Update base path for deployment"
git push
```

### Step 5: Automatic Deployment

The GitHub Actions workflow will automatically:
- Build your app when you push to `main` branch
- Deploy to GitHub Pages on `gh-pages` branch

Your site will be available at:
`https://YOUR_USERNAME.github.io/smarttask/`

## 🔧 Manual Deployment (Alternative)

If GitHub Actions doesn't work:

```bash
# Build the project
npm run build

# Install gh-pages package
npm install --save-dev gh-pages

# Add deploy script to package.json
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

## 📝 Important Notes

1. **Backend**: The backend API needs to be deployed separately (Heroku, Railway, Render, etc.)
2. **API URL**: Update API base URL in production to point to your deployed backend
3. **Environment Variables**: Set GEMINI_API_KEY in GitHub Secrets if needed

## 🌐 Backend Deployment

Deploy `server` folder to:
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **Render**: Connect GitHub repo
- **Vercel**: Use serverless functions

Update frontend `.env` or `vite.config.ts` with production API URL.

