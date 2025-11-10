# Deployment Guide

Complete deployment guide for the Homeless Aid Platform.

## 🚀 Deployment Options

### Option 1: Docker (Recommended)

**Prerequisites:**
- Docker 20+
- Docker Compose 2+

**Steps:**

1. **Create Docker Compose file:**

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - API_HOST=0.0.0.0
      - API_PORT=5000
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./backend:/app
    command: gunicorn -w 4 -b 0.0.0.0:5000 api.app:app

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000
    depends_on:
      - backend
    command: npm start

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=homeless_aid
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

2. **Create Dockerfiles:**

**Backend Dockerfile:**
```dockerfile
# backend/Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "api.app:app"]
```

**Frontend Dockerfile:**
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

3. **Deploy:**

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Option 2: Vercel (Frontend) + AWS (Backend)

**Frontend on Vercel:**

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy automatically

**Backend on AWS EC2:**

```bash
# SSH into EC2 instance
ssh -i key.pem ubuntu@your-ec2-ip

# Install dependencies
sudo apt update
sudo apt install python3-pip nginx

# Clone repository
git clone https://github.com/your-repo/homeless-aid-platform.git
cd homeless-aid-platform/backend

# Install Python packages
pip3 install -r requirements.txt

# Configure Nginx
sudo nano /etc/nginx/sites-available/homeless-aid

# Nginx config:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/homeless-aid /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Run with Gunicorn
gunicorn -w 4 -b 127.0.0.1:5000 api.app:app
```

### Option 3: Heroku

**Backend:**

```bash
cd backend

# Create Procfile
echo "web: gunicorn api.app:app" > Procfile

# Deploy
heroku create homeless-aid-backend
heroku config:set OPENAI_API_KEY=your-key
git push heroku main
```

**Frontend:**

```bash
cd frontend

# Deploy to Vercel
vercel --prod
```

## 🔐 Security Checklist

- [ ] Use HTTPS (SSL/TLS certificates)
- [ ] Set secure environment variables
- [ ] Enable CORS properly
- [ ] Implement rate limiting
- [ ] Use strong passwords
- [ ] Enable firewall
- [ ] Regular security updates
- [ ] Backup database regularly
- [ ] Monitor logs
- [ ] Use secrets management (AWS Secrets Manager)

## 📊 Monitoring

**Backend Monitoring:**

```python
# Add to backend
from prometheus_flask_exporter import PrometheusMetrics

metrics = PrometheusMetrics(app)
```

**Frontend Monitoring:**

```typescript
// Add to frontend
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
})
```

## 🔄 CI/CD Pipeline

**GitHub Actions:**

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Test Backend
        run: |
          cd backend
          pip install -r requirements.txt
          python test_api.py
      - name: Test Frontend
        run: |
          cd frontend
          npm install
          npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Your deployment commands
```

## 📝 Environment Variables

**Production Backend:**
```bash
API_HOST=0.0.0.0
API_PORT=5000
DEBUG=False
OPENAI_API_KEY=sk-prod-key
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
```

**Production Frontend:**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
```

## 🔧 Performance Optimization

**Backend:**
- Use Gunicorn with multiple workers
- Enable Redis caching
- Use CDN for static files
- Optimize database queries
- Enable gzip compression

**Frontend:**
- Enable Next.js image optimization
- Use CDN (Vercel Edge Network)
- Enable caching headers
- Lazy load components
- Minimize bundle size

## 📚 Additional Resources

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [API Documentation](./docs/API.md)
- [Security Guide](./docs/SECURITY.md)
