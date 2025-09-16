# Vercel Environment Variables Setup

## The Issue
Your app is deployed on Vercel but the Supabase connection isn't working because the environment variables aren't configured on Vercel.

## Solution: Set Environment Variables on Vercel

### Step 1: Go to Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and log in
2. Find your `king-countdown` project
3. Click on it to open the project dashboard

### Step 2: Add Environment Variables
1. Click on the **"Settings"** tab
2. Click on **"Environment Variables"** in the left sidebar
3. Add these two environment variables:

#### Variable 1:
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Your Supabase project URL (from your `.env.local` file)
- **Environment**: Production, Preview, Development (check all three)

#### Variable 2:
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Your Supabase anon key (from your `.env.local` file)
- **Environment**: Production, Preview, Development (check all three)

#### Variable 3 (Optional):
- **Name**: `NEXT_PUBLIC_UPLOAD_PASSWORD`
- **Value**: `King2025` (or whatever password you want)
- **Environment**: Production, Preview, Development (check all three)

### Step 3: Redeploy
1. After adding the environment variables, go to the **"Deployments"** tab
2. Click the **"Redeploy"** button on the latest deployment
3. Or push a new commit to trigger a new deployment

### Step 4: Test
1. Once redeployed, test the password functionality
2. Try uploading an image
3. Check the browser console for any remaining errors

## Finding Your Supabase Values

If you need to find your Supabase values:

1. Go to [supabase.com](https://supabase.com) and log in
2. Open your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key

## Expected Result

After setting up the environment variables and redeploying:
- ✅ Password should work (try "King2025")
- ✅ Images should upload successfully
- ✅ Images should appear in the gallery
- ✅ No more "Supabase environment variables not found" errors in console

## Troubleshooting

If it still doesn't work:
1. Check that the environment variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Make sure you checked all three environments (Production, Preview, Development)
3. Try redeploying again
4. Check the browser console for any new error messages
