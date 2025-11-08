# AWS Security Specialty Quiz Platform - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- **Git** installed
- **GitHub account** with repository access
- **Terraform** v1.6+ installed
- **Node.js** v18+ (for local development)
- **Python** 3.8+ (for validation scripts)

### Local Development
```bash
# Clone repository
git clone <your-repo-url>
cd AWS-SCS-C03

# Serve locally
python -m http.server 8000
# OR
npx serve .

# Access at http://localhost:8000
```

## 🌍 Production Deployment

### 1. GitHub Repository Setup

**Create Repository:**
```bash
# Initialize repository
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

**Create Branches:**
```bash
git checkout -b dev
git push -u origin dev
git checkout -b qa  
git push -u origin qa
git checkout main
```

### 2. GitHub Environment Configuration

**Navigate to:** Repository → Settings → Environments

**Create Environments:**
- `dev`
- `qa` 
- `prod`

**Set Environment Variables:**

| Environment | Variable | Example Value |
|-------------|----------|---------------|
| **dev** | `DEV_DOMAIN_NAME` | `dev-quiz.yourdomain.com` |
| **dev** | `BRANCH_NAME` | `dev` |
| **qa** | `QA_DOMAIN_NAME` | `qa-quiz.yourdomain.com` |
| **qa** | `BRANCH_NAME` | `qa` |
| **prod** | `PROD_DOMAIN_NAME` | `quiz.yourdomain.com` |
| **prod** | `BRANCH_NAME` | `main` |

**All Environments:**
- `APP_NAME`: `aws-scs-quiz`
- `REPOSITORY_NAME`: `your-username/repo-name`
- `REPOSITORY_OWNER`: `your-username`

### 3. GitHub Secrets

**Repository → Settings → Secrets and Variables → Actions**

**Required Secrets:**
- `GITHUB_TOKEN`: Automatically provided by GitHub

### 4. Terraform Backend (Optional)

**For production, configure remote state:**
```hcl
# terraform/backend.tf
terraform {
  backend "s3" {
    bucket = "your-terraform-state-bucket"
    key    = "quiz-platform/terraform.tfstate"
    region = "us-east-1"
  }
}
```

### 5. Deploy to Environments

**Development:**
```bash
git checkout dev
git add .
git commit -m "Deploy to dev"
git push origin dev
```

**QA:**
```bash
git checkout qa
git merge dev
git push origin qa
```

**Production:**
```bash
git checkout main
git merge qa
git push origin main
```

## 🔧 Configuration

### Custom Domain Setup

**GitHub Pages:**
1. Repository → Settings → Pages
2. Source: Deploy from branch
3. Branch: `main` / `dev` / `qa`
4. Custom domain: Enter your domain
5. Enforce HTTPS: ✅

**DNS Configuration:**
```
# CNAME Records
dev-quiz.yourdomain.com  → your-username.github.io
qa-quiz.yourdomain.com   → your-username.github.io  
quiz.yourdomain.com      → your-username.github.io
```

### Alternative Hosting Platforms

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir .
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 📝 Content Management

### Adding Questions

**Edit `data/questions.json`:**
```json
{
  "id": 21,
  "type": "single",
  "question": "Your question text here...",
  "options": [
    "Option A",
    "Option B", 
    "Option C",
    "Option D"
  ],
  "correct": [1],
  "explanation": "Explanation text...",
  "keywords": ["keyword1", "keyword2"]
}
```

**Question Types:**
- `"type": "single"` - Radio buttons, `"correct": [index]`
- `"type": "multiple"` - Checkboxes, `"correct": [index1, index2]`

### Validation

**Local Testing:**
```bash
# Validate JSON
python -m json.tool data/questions.json

# Check JavaScript syntax
node -c js/quiz-engine.js

# Run security scan
grep -r "password\|secret\|key" --include="*.js" .
```

## 🔒 Security & Permissions

### GitHub Actions Permissions

**Repository → Settings → Actions → General**
- Workflow permissions: **Read and write permissions**
- Allow GitHub Actions to create and approve pull requests: ✅

### Branch Protection (Production)

**Repository → Settings → Branches → Add rule**
- Branch name pattern: `main`
- Require pull request reviews: ✅
- Require status checks: ✅
  - `build-and-test`
  - `security-scan`
- Restrict pushes: ✅

## 🚨 Troubleshooting

### Common Issues

**Deployment Fails:**
```bash
# Check GitHub Actions logs
# Repository → Actions → Failed workflow

# Common fixes:
# 1. Verify environment variables
# 2. Check branch names match configuration
# 3. Ensure GITHUB_TOKEN has permissions
```

**Questions Not Loading:**
```bash
# Validate JSON syntax
python -m json.tool data/questions.json

# Check browser console for errors
# F12 → Console tab
```

**Terraform Errors:**
```bash
# Check terraform syntax
cd terraform
terraform validate

# Verify environment variables are set
echo $DOMAIN_NAME
```

### Local Development Issues

**CORS Errors:**
```bash
# Use proper local server
python -m http.server 8000
# NOT: file:// protocol
```

**JavaScript Errors:**
```bash
# Check all scripts load in order
# utils.js must load before other modules
```

## 📊 Monitoring

### GitHub Actions Status
- Repository → Actions tab
- Monitor deployment status
- Check logs for errors

### Performance Monitoring
```javascript
// Add to quiz-engine.js for monitoring
console.log('Quiz loaded in:', Date.now() - pageStartTime, 'ms');
```

### Analytics (Optional)
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔄 CI/CD Pipeline

### Workflow Triggers
- **Push to `dev`** → Deploy to dev environment
- **Push to `qa`** → Deploy to QA environment  
- **Push to `main`** → Deploy to production
- **Pull Request** → Run tests only

### Pipeline Stages
1. **Validation** - JSON, HTML, JavaScript syntax
2. **Security Scan** - Check for sensitive data
3. **Terraform Plan** - Infrastructure changes
4. **Deploy** - Apply changes and deploy
5. **Notification** - Deployment summary

## 📞 Support

### Getting Help
- Check GitHub Actions logs first
- Validate JSON syntax locally
- Test in browser console
- Review Terraform plan output

### Useful Commands
```bash
# Test locally
python -m http.server 8000

# Validate files
python -m json.tool data/questions.json
node -c js/*.js

# Check git status
git status
git log --oneline -5
```

---

**🎯 Ready to Deploy!** Follow the steps above to get your AWS Security Specialty quiz platform live in minutes.