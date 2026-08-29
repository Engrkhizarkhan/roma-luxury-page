# SSAROMA production deployment (`ssaroma.pk`)

This runbook deploys the Next.js application as one persistent Node.js process behind Nginx on an Ubuntu VPS. It uses systemd for process supervision, Let's Encrypt for TLS, MongoDB for application data, and Cloudinary for media.

## 1. Production prerequisites

- An Ubuntu 22.04 or 24.04 VPS with at least 2 GB RAM, 2 vCPU, and swap enabled.
- `A` records for `ssaroma.pk` and `www.ssaroma.pk` pointing to the VPS IPv4 address. Add `AAAA` records only if IPv6 is configured on the VPS.
- Node.js 22 LTS. Next.js 16.3.3 requires Node.js 20.9.0 or newer; Node 22 LTS is the recommended production line for this project.
- A MongoDB Atlas cluster or another MongoDB replica set. Checkout and order-status changes use transactions and will not work on a standalone MongoDB server.
- A MongoDB user restricted to `readWrite` on the SSAROMA database and an Atlas network rule allowing only the VPS egress IP where practical.
- A Cloudinary account and API credentials.
- SSH key access to the VPS and a working administrator email address for Let's Encrypt notices.

Do not point public traffic to the VPS until the build and local health check in section 5 pass.

## 2. Harden the base server

Log in as a sudo-capable user and update the server:

```bash
sudo apt update
sudo apt full-upgrade -y
sudo apt install -y nginx git curl ca-certificates gnupg ufw certbot python3-certbot-nginx
```

Install Node.js 22 LTS from an official Node.js distribution channel, then verify the runtime:

```bash
node --version
npm --version
```

`node --version` must report 22.x, or at minimum 20.9.0.

Configure the firewall before enabling it. Keep the actual SSH service rule if it differs from `OpenSSH`:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status verbose
```

Port 3000 must not be opened in UFW or the VPS provider firewall.

Create a non-login application account and deployment directories:

```bash
sudo adduser --system --group --home /var/www/ssaroma ssaroma
sudo install -d -o ssaroma -g ssaroma /var/www/ssaroma/releases
sudo install -d -o ssaroma -g ssaroma /var/www/ssaroma/shared
```

## 3. Create the production environment

Create a root-owned editing session for the shared environment file, then make the application account its owner:

```bash
sudo install -m 600 -o ssaroma -g ssaroma /dev/null /var/www/ssaroma/shared/.env.production
sudoedit /var/www/ssaroma/shared/.env.production
```

Use this shape:

```dotenv
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER/ssaroma?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_USERNAME=your_private_admin_username
ADMIN_PASSWORD=use-a-long-unique-password-manager-generated-password
AUTH_SECRET=replace_with_output_from_openssl
NEXT_PUBLIC_SITE_URL=https://ssaroma.pk
SESSION_TTL_HOURS=8
```

Generate `AUTH_SECRET` on the VPS:

```bash
openssl rand -base64 48
```

Paste the output into the environment file. `AUTH_SECRET` must contain at least 32 characters and `ADMIN_PASSWORD` at least 12. Never commit `.env.production`, paste its contents into tickets/chat, or reuse these credentials elsewhere.

`NEXT_PUBLIC_SITE_URL` is embedded during `next build`; it must already be `https://ssaroma.pk` before building.

## 4. Create the first release

Replace the repository URL with the real Git remote. For a private repository, configure a read-only deploy key for the `ssaroma` account first.

```bash
release_dir=/var/www/ssaroma/releases/$(date +%Y%m%d%H%M%S)
sudo -u ssaroma git clone --depth 1 YOUR_GIT_REPOSITORY_URL "$release_dir"
sudo -u ssaroma ln -s /var/www/ssaroma/shared/.env.production "$release_dir/.env.production"
cd "$release_dir"
sudo -u ssaroma npm ci
```

Run every release gate:

```bash
sudo -u ssaroma npm test
sudo -u ssaroma npm run typecheck
sudo -u ssaroma npm run lint
sudo -u ssaroma npm audit --omit=dev
sudo -u ssaroma npm run build
sudo -u ssaroma npm run audit:db
```

All commands must exit successfully. Do not use `--force` to bypass an npm audit or build failure.

For a completely empty database only, seed the catalog once and audit again:

```bash
sudo -u ssaroma npm run db:seed
sudo -u ssaroma npm run audit:db
```

The seed uploads brand media to Cloudinary. Do not run it as a routine deployment step.

Activate the release:

```bash
sudo ln -sfn "$release_dir" /var/www/ssaroma/current
sudo chown -h ssaroma:ssaroma /var/www/ssaroma/current
```

## 5. Run Next.js with systemd

Create `/etc/systemd/system/ssaroma.service`:

```ini
[Unit]
Description=SSAROMA Next.js storefront
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ssaroma
Group=ssaroma
WorkingDirectory=/var/www/ssaroma/current
Environment=NODE_ENV=production
ExecStart=/usr/bin/node /var/www/ssaroma/current/node_modules/next/dist/bin/next start -H 127.0.0.1 -p 3000
Restart=always
RestartSec=5
KillSignal=SIGTERM
TimeoutStopSec=30
NoNewPrivileges=true
PrivateTmp=true
PrivateDevices=true
ProtectSystem=full
ProtectHome=true
ReadWritePaths=/var/www/ssaroma
UMask=0027
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

If `command -v node` is not `/usr/bin/node`, use its exact absolute path in `ExecStart`.

Enable and verify the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now ssaroma
sudo systemctl status ssaroma --no-pager
curl --fail --silent --show-error http://127.0.0.1:3000/api/health
```

The health response must report `"ok":true` and `"database":"reachable"` before configuring Nginx.

## 6. Configure Nginx

Create `/etc/nginx/snippets/ssaroma-proxy.conf`:

```nginx
proxy_pass http://ssaroma_next;
proxy_http_version 1.1;
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $remote_addr;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header Connection "";
proxy_read_timeout 60s;
proxy_send_timeout 60s;
proxy_buffering off;
```

Using `$remote_addr` instead of an incoming `X-Forwarded-For` value is intentional: Nginx is the only trusted proxy in this design, and the application uses that address for abuse controls. Revisit this only if a trusted CDN is later placed in front of Nginx.

Create the initial `/etc/nginx/sites-available/ssaroma.pk` configuration:

```nginx
upstream ssaroma_next {
    server 127.0.0.1:3000;
    keepalive 32;
}

limit_req_zone $binary_remote_addr zone=ssaroma_login:10m rate=10r/m;

server {
    listen 80;
    listen [::]:80;
    server_name ssaroma.pk www.ssaroma.pk;
    server_tokens off;
    client_max_body_size 64k;

    location = /api/health {
        allow 127.0.0.1;
        allow ::1;
        deny all;
        include /etc/nginx/snippets/ssaroma-proxy.conf;
    }

    location = /api/admin/login {
        limit_req zone=ssaroma_login burst=5 nodelay;
        include /etc/nginx/snippets/ssaroma-proxy.conf;
    }

    location = /api/admin/media {
        client_max_body_size 45m;
        include /etc/nginx/snippets/ssaroma-proxy.conf;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    location / {
        include /etc/nginx/snippets/ssaroma-proxy.conf;
    }
}
```

Enable and validate it:

```bash
sudo ln -s /etc/nginx/sites-available/ssaroma.pk /etc/nginx/sites-enabled/ssaroma.pk
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 7. Issue TLS certificates and canonicalize the domain

After DNS resolves to this VPS from public networks, issue the certificate. Replace the email address with a mailbox you monitor:

```bash
sudo certbot --nginx -d ssaroma.pk -d www.ssaroma.pk --redirect --agree-tos --no-eff-email -m admin@ssaroma.pk
sudo nginx -t
sudo systemctl reload nginx
```

Certbot may initially proxy both hostnames. Replace the site file with the final configuration below so every request has one canonical host. Keep the certificate paths Certbot actually generated if they differ:

```nginx
upstream ssaroma_next {
    server 127.0.0.1:3000;
    keepalive 32;
}

limit_req_zone $binary_remote_addr zone=ssaroma_login:10m rate=10r/m;

server {
    listen 80;
    listen [::]:80;
    server_name ssaroma.pk www.ssaroma.pk;
    return 301 https://ssaroma.pk$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.ssaroma.pk;

    ssl_certificate /etc/letsencrypt/live/ssaroma.pk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ssaroma.pk/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://ssaroma.pk$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ssaroma.pk;
    server_tokens off;
    client_max_body_size 64k;

    ssl_certificate /etc/letsencrypt/live/ssaroma.pk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ssaroma.pk/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location = /api/health {
        allow 127.0.0.1;
        allow ::1;
        deny all;
        include /etc/nginx/snippets/ssaroma-proxy.conf;
    }

    location = /api/admin/login {
        limit_req zone=ssaroma_login burst=5 nodelay;
        include /etc/nginx/snippets/ssaroma-proxy.conf;
    }

    location = /api/admin/media {
        client_max_body_size 45m;
        include /etc/nginx/snippets/ssaroma-proxy.conf;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    location / {
        include /etc/nginx/snippets/ssaroma-proxy.conf;
    }
}
```

Validate and reload the final configuration:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

`proxy_buffering off` in the shared proxy snippet is intentional so App Router streaming is not buffered.

Validate certificate renewal:

```bash
sudo certbot renew --dry-run
systemctl list-timers | grep certbot
```

## 8. Production verification

Run these automated checks:

```bash
curl --fail --silent --show-error https://ssaroma.pk/ > /dev/null
curl --fail --silent --show-error https://ssaroma.pk/products > /dev/null
curl --fail --silent --show-error https://ssaroma.pk/robots.txt
curl --fail --silent --show-error https://ssaroma.pk/sitemap.xml > /dev/null
curl --head https://ssaroma.pk/
curl --head https://www.ssaroma.pk/
```

Confirm the apex response includes HSTS, CSP, `X-Content-Type-Options`, `X-Frame-Options`, and the expected canonical URLs. Confirm `www` redirects to the apex domain.

Then complete one controlled browser smoke test on desktop and mobile widths:

1. Open the home page, play/mute the hero if video is enabled, and verify all homepage anchors, the map, Instagram, and contact links.
2. Browse, search, filter, sort, and open every product type. Add, update, and remove bag items; confirm quantities never exceed stock or nine.
3. Submit one real test COD order, verify the confirmation number, stock decrement, order appearance in `/admin`, each allowed status transition, and cancellation restocking for a separate non-delivered test order.
4. Validate a promotion at checkout and confirm its server-calculated discount and usage count.
5. Submit a contact enquiry and mark it read/resolved in the Enquiries dashboard.
6. Upload a small image and video in the dashboard, save them, and verify Cloudinary delivery on the public site.
7. Verify invalid admin credentials are rejected, valid credentials set a secure HTTP-only cookie, logout works, and `/admin` redirects when signed out.
8. Check the browser console and network panel for runtime, hydration, CSP, mixed-content, 4xx, and 5xx errors.

Delete or clearly label test business records according to your operating policy; do not delete products that belong to order history.

## 9. Routine releases and rollback

For each release, create a new timestamped directory, link the shared environment, run `npm ci`, all release gates, and `npm run build`. Only then switch `current` and restart:

```bash
sudo ln -sfn /var/www/ssaroma/releases/RELEASE_TO_ACTIVATE /var/www/ssaroma/current
sudo chown -h ssaroma:ssaroma /var/www/ssaroma/current
sudo systemctl restart ssaroma
curl --fail --silent --show-error http://127.0.0.1:3000/api/health
```

To roll back, point `current` to the previous intact release, restart the service, and run the same health check. Keep the previous release until production verification is complete.

## 10. Operations and recovery

Useful commands:

```bash
sudo systemctl status ssaroma --no-pager
sudo journalctl -u ssaroma -n 200 --no-pager
sudo journalctl -u ssaroma -f
sudo nginx -t
sudo tail -f /var/log/nginx/access.log /var/log/nginx/error.log
sudo ss -lntp | grep 3000
```

Operational requirements:

- Enable MongoDB Atlas automated backups or equivalent replica-set backups and test restoring them.
- Protect Cloudinary access, retain original media according to the business recovery policy, and alert on unusual usage.
- Back up `/var/www/ssaroma/shared/.env.production` into an encrypted secrets manager; never into Git.
- Apply OS security updates regularly and restart after kernel/runtime updates during a maintenance window.
- Run `npm audit --omit=dev`, the full test/build gate, and the database audit before every deployment.
- Monitor `/api/health` locally and alert on non-200 responses, service restarts, disk pressure, memory pressure, certificate expiry, MongoDB errors, and sustained Nginx 5xx responses.
- Rotate `AUTH_SECRET`, the administrator password, MongoDB credentials, and Cloudinary credentials through a planned maintenance procedure. Rotating `AUTH_SECRET` signs out all administrators.
