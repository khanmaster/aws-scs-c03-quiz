# AWS Security Specialty (SCS-C03) Quiz Platform

A comprehensive, interactive quiz platform for AWS Security Specialty certification preparation with multi-environment deployment capabilities.

## 🚀 Features

- **Multiple Quiz Lengths**: 10, 20, 30, and 65-question options
- **Interactive Learning**: Show Answer, Key Words highlighting, Reset functionality
- **Dual Timer System**: Total quiz time and per-question timing
- **Progress Tracking**: Navigation between questions with completion status
- **Comprehensive Results**: Detailed analytics and performance breakdown
- **Responsive Design**: Works on desktop and mobile devices
- **Multi-Environment Deployment**: Dev, QA, and Production environments

## 📁 Project Structure

```
AWS-SCS-C03/
├── index.html                 # Landing page with quiz selection
├── quiz.html                  # Main quiz interface
├── results.html               # Quiz results and analytics
├── data/
│   ├── questions.json         # Master question pool
│   └── config.json           # Quiz configurations
├── js/
│   ├── quiz-config.js         # Quiz length management
│   ├── question-loader.js     # Random selection logic
│   ├── quiz-engine.js         # Core quiz functionality
│   ├── timer.js              # Timer system
│   ├── progress.js           # Progress tracking
│   └── results.js            # Results management
├── css/
│   └── styles.css            # Unified styling
├── terraform/
│   ├── main.tf               # Infrastructure definition
│   └── environments/
│       └── environments.tfvars # Template variables
└── .github/workflows/
    └── deploy.yml            # CI/CD pipeline
```

## 🎯 Quiz Options

| Quiz Type | Questions | Duration | Purpose |
|-----------|-----------|----------|---------|
| Quick Practice | 10 | 15-20 min | Short practice session |
| Standard Practice | 20 | 30-40 min | Regular practice session |
| Extended Practice | 30 | 45-60 min | Extended practice session |
| **Full Practice Exam** | 65 | 130 min | Complete exam simulation |

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Data Storage**: JSON files (static)
- **Infrastructure**: Terraform
- **CI/CD**: GitHub Actions
- **Hosting**: GitHub Pages / Netlify / Vercel

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AWS-SCS-C03
   ```

2. **Open locally**
   ```bash
   # Serve files locally (Python)
   python -m http.server 8000
   
   # Or use Node.js
   npx serve .
   ```

3. **Access the application**
   - Open `http://localhost:8000` in your browser
   - Select a quiz length and start practicing!

## 🔧 Development

### Adding Questions

Edit `data/questions.json` to add new questions:

```json
{
  "id": 11,
  "type": "single",
  "question": "Your question text here...",
  "options": [
    "Option A",
    "Option B", 
    "Option C",
    "Option D"
  ],
  "correct": [1],
  "explanation": "Explanation of correct and incorrect answers...",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}
```

### Question Types

- **Single Choice**: `"type": "single"`, `"correct": [index]`
- **Multiple Choice**: `"type": "multiple"`, `"correct": [index1, index2]`

### Local Testing

```bash
# Validate JSON
python -m json.tool data/questions.json

# Check JavaScript syntax
node -c js/quiz-engine.js

# Run security scan
grep -r "password\|secret\|key" --include="*.js" .
```

## 🌍 Deployment

### Environment Configuration

Set up GitHub repository variables:

| Environment | Variable | Example Value |
|-------------|----------|---------------|
| Development | `DEV_DOMAIN_NAME` | `dev-quiz.example.com` |
| QA | `QA_DOMAIN_NAME` | `qa-quiz.example.com` |
| Production | `PROD_DOMAIN_NAME` | `quiz.example.com` |

### Deployment Process

1. **Development**: Push to `dev` branch → Auto-deploy to dev environment
2. **QA**: Push to `qa` branch → Auto-deploy to QA environment  
3. **Production**: Push to `main` branch → Auto-deploy to production

### Infrastructure as Code

```bash
cd terraform

# Generate environment-specific variables
export DOMAIN_NAME="quiz.example.com"
export ENVIRONMENT="prod"
export BRANCH_NAME="main"
envsubst < environments/environments.tfvars > prod.tfvars

# Deploy infrastructure
terraform init
terraform plan -var-file="prod.tfvars"
terraform apply -var-file="prod.tfvars"
```

## 📊 Features Overview

### Interactive Quiz Elements

- ✅ **Show Answer**: Reveals correct/incorrect indicators with explanations
- 🔍 **Key Words**: Highlights important terms in questions
- 🔄 **Reset**: Clears selections and returns to original state
- ⏱️ **Timers**: Tracks total time and per-question timing
- 📍 **Navigation**: Jump between questions with progress indicators

### Results & Analytics

- Score calculation with percentage and fraction
- Time analysis (total, average, fastest, slowest)
- Performance breakdown per question
- Completion rate tracking
- Detailed explanations for review

### Responsive Design

- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-friendly navigation
- Optimized for both desktop and mobile use

## 🔒 Security Features

- No sensitive data storage
- Client-side only processing
- HTTPS enforcement
- Input validation and sanitization
- Security scanning in CI/CD pipeline

## 📈 Scalability Roadmap

### Phase 1: Static Foundation (Current)
- ✅ Static SPA with JSON data
- ✅ Multi-environment deployment
- ✅ Comprehensive quiz functionality

### Phase 2: Enhanced UX
- User progress persistence
- Offline mode (PWA)
- Advanced analytics
- Multiple certification tracks

### Phase 3: Backend Services
- User authentication
- Progress synchronization
- Advanced question management
- Performance insights

### Phase 4: Full Platform
- User management
- Subscription model
- Advanced reporting
- Multi-tenant architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📖 Documentation: [Wiki](https://github.com/your-repo/wiki)

---

**Happy Learning! 🎓**

Prepare for your AWS Security Specialty certification with confidence using this comprehensive quiz platform.
