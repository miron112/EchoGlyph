# EchoGlyph

EchoGlyph is a full-stack music logo recognition studio. A user draws a band logo on a canvas, the app sends the drawing to a Next.js API route, Polza.ai analyzes the image, and the UI shows the recognized band with confidence, alternatives, description, and top songs.

## Stack

- Next.js App Router
- React
- TypeScript
- TailwindCSS
- Framer Motion
- Next.js API routes
- Polza.ai vision model
- localStorage history
- Docker standalone production build

## Environment

Create `.env.local` in the project root:

```env
POLZA_AI_API_KEY=your_polza_ai_api_key_here
POLZA_AI_MODEL=openai/gpt-4o
```

Optional local mock fallback:

```env
RECOGNITION_FALLBACK=heuristic
```

Do not commit `.env.local`. Use `.env.example` only as a public template.

## Local Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Quality checks:

```bash
npm run lint
npm run build
```

## Docker

The project uses Next.js standalone output, so the production Docker image is smaller and only runs the compiled server.

Build and run with Docker Compose:

```bash
docker compose up --build
```

Run in the background:

```bash
docker compose up -d --build
```

View logs:

```bash
docker compose logs -f
```

Stop:

```bash
docker compose down
```

If Docker Compose is not available, run with plain Docker:

```bash
docker build -t echoglyph .
docker run -d --name echoglyph --env-file .env.local -p 3000:3000 echoglyph
```

## Server Deployment

Recommended minimum for a small demo deployment:

```text
1 vCPU
1 GB RAM
1 GB swap
```

This is enough to run the already-built container because AI recognition is handled by Polza.ai. Building the Docker image may need more memory, so for very small servers it is better to build in CI or on a stronger machine and deploy the ready image.

## HTTPS With Caddy

Point your domain `A` record to the server IP first.

Example domain:

```text
sielomqr.ru
```

Install Caddy on Ubuntu/Debian:

```bash
sudo apt update
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

Create or edit `/etc/caddy/Caddyfile`:

```caddyfile
sielomqr.ru {
    reverse_proxy localhost:3000
}
```

Validate the config:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
```

Start Caddy as a system service:

```bash
sudo systemctl enable caddy
sudo systemctl restart caddy
sudo systemctl status caddy
```

Caddy will automatically issue and renew the HTTPS certificate.

If Caddy fails because port `80` or `443` is busy, check what is using the ports:

```bash
sudo ss -ltnp | grep -E ':80|:443'
```

Stop conflicting services such as Nginx or Apache if needed:

```bash
sudo systemctl stop nginx
sudo systemctl disable nginx
```

or:

```bash
sudo systemctl stop apache2
sudo systemctl disable apache2
```

## Production Commands

Start app container:

```bash
docker compose up -d --build
```

Restart app:

```bash
docker compose restart
```

Check app logs:

```bash
docker compose logs -f echoglyph
```

Check Caddy logs:

```bash
sudo journalctl -u caddy.service --no-pager -n 80
```

Check HTTPS:

```bash
curl -I https://sielomqr.ru
```
