# eCAP - eCommerce Acceleration Programme

A full-stack project directory built with **Next.js**, **Prisma**, and **Tailwind CSS**. Supports multi-language content (English, Arabic, French), project management via an admin panel, and filtering by countries and industries.

---

## Table of Contents

- [Local Development](#local-development)
- [Switch from SQLite to PostgreSQL](#switch-from-sqlite-to-postgresql)
- [Deploy on DigitalOcean](#deploy-on-digitalocean)
  - [Option A: App Platform (Recommended)](#option-a-app-platform-recommended)
  - [Option B: Droplet (VPS)](#option-b-droplet-vps)
- [Environment Variables](#environment-variables)
- [Default Admin Credentials](#default-admin-credentials)

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your values (see Environment Variables section)

# 3. Generate Prisma client and run migrations
npx prisma generate
npx prisma db push

# 4. Seed the database (creates admin user, countries, industries, sample projects)
npx tsx prisma/seed.ts

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

---

## Switch from SQLite to PostgreSQL

The project uses SQLite by default for local development. To use PostgreSQL (required for production), make two changes:

### 1. Update `prisma/schema.prisma`

Change the datasource provider from `sqlite` to `postgresql`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Update `.env`

Replace the SQLite connection string with your PostgreSQL URL:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
```

### 3. Regenerate and migrate

```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

---

## Deploy on DigitalOcean

### Prerequisites

- A [DigitalOcean](https://www.digitalocean.com/) account
- Your code pushed to a **GitHub** repository
- A **DigitalOcean Managed PostgreSQL** database (or any external PostgreSQL)

### Create a Managed PostgreSQL Database

1. Go to **DigitalOcean Dashboard** > **Databases** > **Create Database Cluster**
2. Choose **PostgreSQL** (latest version)
3. Pick a plan (Basic $15/mo is fine to start)
4. Choose your datacenter region
5. Name your database cluster and click **Create**
6. Once ready, go to the **Connection Details** tab
7. Copy the **Connection String** — it looks like:
   ```
   postgresql://doadmin:PASSWORD@db-xxx.ondigitalocean.com:25060/defaultdb?sslmode=require
   ```

---

### Option A: App Platform (Recommended)

The simplest way to deploy. DigitalOcean handles builds, SSL, and scaling.

#### Step 1: Create the App

1. Go to **DigitalOcean Dashboard** > **Apps** > **Create App**
2. Connect your **GitHub** repository
3. Select the branch to deploy (e.g., `main`)

#### Step 2: Configure the App

1. **Type**: Web Service
2. **Build Command**:
   ```bash
   npm install && npx prisma generate && npx prisma db push && npm run build
   ```
3. **Run Command**:
   ```bash
   npm start
   ```
4. **HTTP Port**: `3000`

#### Step 3: Set Environment Variables

In the App settings, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://doadmin:PASSWORD@db-xxx.ondigitalocean.com:25060/defaultdb?sslmode=require` |
| `JWT_SECRET` | A strong random string (e.g., generate with `openssl rand -base64 32`) |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `en` |

#### Step 4: Add Trusted Source to Database

1. Go to your **Database Cluster** settings
2. Under **Trusted Sources**, add your App Platform app
3. This allows your app to connect to the database

#### Step 5: Deploy

Click **Create Resources**. The app will build and deploy automatically.

#### Step 6: Seed the Database (First Time)

After the first deploy, open the **Console** tab in your app and run:

```bash
npx tsx prisma/seed.ts
```

Or run it locally pointing to the remote database:

```bash
DATABASE_URL="postgresql://doadmin:PASSWORD@db-xxx.ondigitalocean.com:25060/defaultdb?sslmode=require" npx tsx prisma/seed.ts
```

---

### Option B: Droplet (VPS)

For full control over the server.

#### Step 1: Create a Droplet

1. Go to **DigitalOcean Dashboard** > **Droplets** > **Create Droplet**
2. Choose **Ubuntu 22.04 LTS**
3. Pick a plan (Basic $12/mo or higher)
4. Add your SSH key
5. Create the Droplet

#### Step 2: SSH into the Server

```bash
ssh root@YOUR_DROPLET_IP
```

#### Step 3: Install Node.js and Dependencies

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Install Nginx for reverse proxy
apt-get install -y nginx
```

#### Step 4: Clone and Setup the App

```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git ecap
cd ecap

# Install dependencies
npm install
```

#### Step 5: Configure Environment

```bash
nano .env
```

Add the following:

```env
DATABASE_URL="postgresql://doadmin:PASSWORD@db-xxx.ondigitalocean.com:25060/defaultdb?sslmode=require"
JWT_SECRET="your-strong-random-secret-here"
NEXT_PUBLIC_DEFAULT_LOCALE="en"
```

#### Step 6: Update Prisma Schema for PostgreSQL

Make sure `prisma/schema.prisma` has:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### Step 7: Build and Seed

```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run build
```

#### Step 8: Start with PM2

```bash
pm2 start npm --name "ecap" -- start
pm2 save
pm2 startup
```

#### Step 9: Configure Nginx

```bash
nano /etc/nginx/sites-available/ecap
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:

```bash
ln -s /etc/nginx/sites-available/ecap /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### Step 10: Add SSL with Let's Encrypt

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

#### Step 11: Add Trusted Source to Database

Go to your **Database Cluster** settings and add your Droplet's IP to **Trusted Sources**.

---

### Updating the Deployment

**App Platform**: Push to your GitHub branch — it auto-deploys.

**Droplet**:

```bash
cd /var/www/ecap
git pull origin main
npm install
npx prisma generate
npx prisma db push
npm run build
pm2 restart ecap
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `postgresql://user:pass@host:5432/dbname?sslmode=require` |
| `JWT_SECRET` | Secret key for signing admin JWT tokens | `openssl rand -base64 32` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default language (`en`, `ar`, or `fr`) | `en` |

---

## Default Admin Credentials

After running the seed script:

- **Email**: `admin@ecap.com`
- **Password**: `admin123`

> Change these immediately after your first login by adding a new admin and deleting the default one.

---

## Important Notes for Production

1. **Change the JWT_SECRET** — never use the default in production.
2. **Change the default admin password** — create a new admin from the admin panel and delete the seed account.
3. **File uploads** are stored in `public/uploads/`. On App Platform, these are ephemeral (lost on redeploy). For persistent storage, consider using [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) or another S3-compatible storage.
4. **Database backups** — DigitalOcean Managed Databases include automatic daily backups.
