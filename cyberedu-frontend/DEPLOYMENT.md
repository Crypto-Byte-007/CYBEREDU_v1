# CyberEdu Deployment Checklist

## Pre-Deployment
- [ ] Backend running on production server
- [ ] MongoDB connection verified
- [ ] Environment variables set
- [ ] SSL certificates obtained

## Frontend Deployment
1. Build static files: `npm run build`
2. Copy to web server: `/var/www/cyberedu`
3. Configure Nginx/Apache
4. Set proper permissions

## Backend Deployment
1. Build Docker image: `docker build -t cyberedu-backend .`
2. Run with: `docker-compose up -d`
3. Verify health: `curl https://api.cyberedu.example.com/health`

## Post-Deployment
- [ ] SSL certificate installed
- [ ] CDN configured (optional)
- [ ] Monitoring set up
- [ ] Backup schedule configured

## Security Checklist
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] File upload restrictions in place
- [ ] Error messages sanitized

## Performance Optimization
- [ ] Static assets minified
- [ ] Images optimized
- [ ] Caching headers set
- [ ] CDN configured
- [ ] Database indexes optimized