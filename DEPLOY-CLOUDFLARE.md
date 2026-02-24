# Deploy FluentGe to Cloudflare Pages

## Why?
- Surge.sh can't handle 14MB+ (podcast files)
- Cloudflare Pages = FREE, fast, supports large files
- Better SEO, custom domain support (.ge domain later)

## Steps for Tornike:

### 1. Get Cloudflare API Token
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Login: tokakhozre@gmail.com
3. Click "Create Token"
4. Use template: "Cloudflare Pages — Edit"
5. Copy the token

### 2. Save token
```bash
echo "CLOUDFLARE_API_TOKEN=your_token_here" >> ~/.openclaw/workspace/.env
```

### 3. Deploy (Mustafa will handle)
```bash
cd ~/. openclaw/workspace/english-app/website
CLOUDFLARE_API_TOKEN=xxx wrangler pages deploy dist-deploy/ --project-name=fluentge
```

### 4. Custom Domain (Later)
- Register fluentge.ge (~25₾/year)
- Add to Cloudflare Pages → Custom Domains
- Automatic SSL/HTTPS

## Current Hosting
- **Live:** fluentge.surge.sh (without podcasts — 3.5MB)
- **With podcasts:** 14MB → needs Cloudflare Pages
