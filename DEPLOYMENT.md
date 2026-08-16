# School ERP deployment checklist

## 1. Backend

Use Node.js 20+ and a persistent MongoDB database. Copy `backend/.env.example` to the hosting provider's environment settings and configure at minimum:

- `MONGO_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGINS` with the exact School Portal and Super Admin origins
- `PORTAL_URL` and `SUPERADMIN_URL`

Run `npm install`, then `npm start`. For the first platform account run `npm run seed:superadmin`. For local development/demo data only, run `npm run seed:demo`.

## 2. School Portal

Deploy `Frontend/frontend` as a Next.js application and set:

`NEXT_PUBLIC_API_URL=https://YOUR_API_HOST/api/v1`

## 3. Super Admin

Deploy `Superadmin` as a second Next.js application and set the same `NEXT_PUBLIC_API_URL`.

## 4. File storage

Development works with local `UPLOAD_DIR`. For production configure Cloudinary (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) so uploaded certificates/documents survive server redeploys. The API secret stays backend-only.

## 5. Online fees (optional)

Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET`. Configure the Razorpay webhook URL as:

`https://YOUR_API_HOST/api/v1/webhooks/razorpay`

Then a School Admin can enable online payments from School Portal → Settings. If credentials are absent or the school setting is disabled, online payment creation is rejected safely.

## 6. Security

- Never commit `.env` files or production secrets.
- Use HTTPS for all three deployed services.
- Set `COOKIE_SECURE=true` in production.
- If the frontends and API use different top-level sites, configure `COOKIE_SAME_SITE=none`; otherwise keep `lax`.
- Restrict `CORS_ORIGINS` to deployed frontend origins.
- Rotate the demo/default passwords before real data is entered.

## 7. Verification

GitHub Actions runs backend tests/syntax validation and production builds for both Next.js applications on every pull request and push to `main`.
