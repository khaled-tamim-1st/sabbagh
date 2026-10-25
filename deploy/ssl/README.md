# SSL Certificates Directory

This directory contains SSL certificates for the Nginx reverse proxy.

## Initial State
A bootstrap self-signed certificate (`cert.pem` and `key.pem`) is included so that `docker compose up` starts cleanly without crashing Nginx.

## Recommended: Cloudflare Origin CA (15-Year Free SSL)
For production deployments using Cloudflare:
1. Go to **Cloudflare Dashboard > SSL/TLS > Origin Server**.
2. Click **Create Certificate**.
3. Keep default RSA (2048) and hostnames (`*.yourdomain.com`, `yourdomain.com`).
4. Select **15 years** validity and click **Create**.
5. Copy the **Origin Certificate** and save it as `deploy/ssl/cert.pem` (overwrite).
6. Copy the **Private Key** and save it as `deploy/ssl/key.pem` (overwrite).
7. In Cloudflare Dashboard, set SSL/TLS encryption mode to **Full (strict)**.
8. Reload Nginx: `docker compose exec nginx nginx -s reload`.

## Alternative: Let's Encrypt (Certbot)
If you are pointing your DNS directly to the AWS server without Cloudflare proxying:
```bash
sudo certbot certonly --standalone -d api.yourdomain.com
# Copy or mount the certs:
sudo cp /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem deploy/ssl/cert.pem
sudo cp /etc/letsencrypt/live/api.yourdomain.com/privkey.pem deploy/ssl/key.pem
docker compose exec nginx nginx -s reload
```
