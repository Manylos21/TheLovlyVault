# The Lovely Vault ✨ — Instagram catalog

## Local development
1. Install **Node.js 20 LTS**.
2. Run `nvm use` in the project root, or select Node.js 20 in your terminal.
3. Create a free project at https://supabase.com.
4. In Supabase > SQL Editor, paste and run `schema.sql`.
5. Copy `.env.example` to `.env.local` and fill in the two keys from `Project Settings > API`.
6. Run `npm install`, then `npm run dev` → http://localhost:3000.
7. Sign up at `/login`, then run the `update profiles ...` query from the bottom of `schema.sql` to become an admin.

> In Supabase > Authentication > Providers > Email, disable **Confirm email** for faster testing.

> Do not use Node.js 25 with Next.js 14.2.15; it may generate invalid development bundles.

## Deploy to Vercel
1. Push the project to a GitHub repository.
2. Open https://vercel.com and import the repository.
3. Select the framework preset **Next.js**. Vercel should detect the configuration automatically.
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy the project. Vercel will run `npm run build` automatically.
6. After deployment, open the generated Vercel URL and confirm that the catalog loads.
7. Configure the custom domain in Vercel if needed.

## Supabase production setup
- Verify that the `products` table has a public `SELECT` policy and that its storage bucket is public.
- In Supabase > Authentication > URL Configuration, set the Site URL to your Vercel domain and add the Vercel domain to **Additional Redirect URLs**.
- For a live store, you can keep the email provider enabled and require email confirmation.
