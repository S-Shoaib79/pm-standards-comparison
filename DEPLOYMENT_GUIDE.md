# 🚀 Vercel Deployment Guide

## Option 1: Deploy with Vercel CLI (Recommended)

### Step 1: Install Vercel CLI
```powershell
npm install -g vercel
```

### Step 2: Login to Vercel
```powershell
vercel login
```
Follow the prompts to authenticate (you can use GitHub, GitLab, or email)

### Step 3: Deploy
```powershell
# Navigate to your project directory
cd "D:\sem 5\PM"

# Deploy to Vercel
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Select your account**
- Link to existing project? **No**
- What's your project's name? **pm-standards-comparison** (or your choice)
- In which directory is your code located? **./** (press Enter)
- Want to override settings? **No**

### Step 4: Deploy to Production
```powershell
vercel --prod
```

Your app will be live at: `https://pm-standards-comparison.vercel.app`

---

## Option 2: Deploy via GitHub (Alternative)

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (e.g., "pm-standards-comparison")
3. Don't initialize with README (we have files already)

### Step 2: Initialize Git and Push
```powershell
cd "D:\sem 5\PM"

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: PM Standards Comparison Tool"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR-USERNAME/pm-standards-comparison.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Connect to Vercel
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

Done! Your app will be live in ~1 minute.

---

## ⚠️ Important: Handling PDF Files

### Issue: Large PDF Files
Your PDF files are quite large (~18MB total). Vercel has deployment size limits.

### Solution Options:

#### Option A: Keep PDFs in Deployment (Easiest)
If total size is under 100MB, this works fine:
```powershell
vercel --prod
```

#### Option B: Host PDFs Separately (Recommended for Large Files)
1. **Upload PDFs to Cloud Storage**:
   - Google Drive (make publicly accessible)
   - Dropbox
   - OneDrive
   - AWS S3
   - GitHub Releases

2. **Update PDF URLs in app.js**:
   ```javascript
   const PDF_FILES = {
       pmbok: "https://your-storage-url/pmbok.pdf",
       prince2: "https://your-storage-url/prince2.pdf",
       iso21500: "https://your-storage-url/iso21500.pdf",
       iso21502: "https://your-storage-url/iso21502.pdf"
   };
   ```

3. **Deploy without PDFs**:
   - Uncomment `*.pdf` in `.vercelignore`
   - Deploy: `vercel --prod`

#### Option C: Use GitHub Large File Storage (LFS)
For keeping PDFs in git but handling large files:
```powershell
git lfs install
git lfs track "*.pdf"
git add .gitattributes
git commit -m "Track PDFs with LFS"
```

---

## 🔧 Troubleshooting

### Problem: "Command 'vercel' not found"
**Solution**: Install Vercel CLI globally
```powershell
npm install -g vercel
```

### Problem: "Deployment size limit exceeded"
**Solution**: Use Option B above (host PDFs separately)

### Problem: "PDF links not working on Vercel"
**Solution**: Check that PDFs are included in deployment or update URLs to external hosting

### Problem: "CORS errors with external PDFs"
**Solution**: Use cloud storage that supports CORS (Google Drive, Dropbox public links)

---

## 📝 Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] All tabs are working
- [ ] Search functionality works
- [ ] PDF links open correctly
- [ ] Responsive design works on mobile
- [ ] No console errors

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain in Vercel:
1. Go to your project settings on Vercel
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Wait for DNS propagation (5-30 minutes)

---

## 🔄 Updating Your Live App

After making changes:

```powershell
cd "D:\sem 5\PM"

# Deploy updates
vercel --prod
```

Or if using GitHub:
```powershell
git add .
git commit -m "Update: description of changes"
git push
```

Vercel will automatically redeploy!

---

## 📊 Monitoring

View your deployment:
- Dashboard: https://vercel.com/dashboard
- Analytics: Available in Vercel dashboard
- Logs: Check deployment logs for any issues

---

## 💡 Pro Tips

1. **Use Preview Deployments**: Every `vercel` command creates a preview URL for testing
2. **Production Deployments**: Use `vercel --prod` only when ready
3. **Environment Variables**: Set in Vercel dashboard if needed
4. **Performance**: Vercel automatically optimizes assets
5. **CDN**: Your app is served from Vercel's global CDN

---

## 🎉 Success!

Once deployed, share your link:
- **Production**: `https://pm-standards-comparison.vercel.app`
- **Custom Domain**: `https://your-domain.com`

Your PM Standards Comparison Tool is now accessible worldwide! 🌍

---

## 🆘 Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- GitHub Issues: Create issue in your repository

