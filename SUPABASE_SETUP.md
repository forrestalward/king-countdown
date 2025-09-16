# 🚀 Supabase Setup Guide for King Countdown

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `king-countdown` (or whatever you prefer)
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

## Step 2: Get Your Credentials

1. Once your project is created, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Create Environment File

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Upload Password (optional - defaults to 'king2024' if not set)
NEXT_PUBLIC_UPLOAD_PASSWORD=King2025
```

**⚠️ Important**: Replace the values with your actual Supabase credentials!

## Step 4: Set Up Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click **"New bucket"**
3. Enter bucket name: `king-photos`
4. Make sure **"Public bucket"** is checked ✅
5. Click **"Create bucket"**

## Step 5: Configure Storage Policies

Go to **Storage** → **Policies** and add these policies:

### Policy 1: Public Read Access
```sql
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'king-photos');
```

### Policy 2: Authenticated Upload
```sql
CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'king-photos' AND auth.role() = 'authenticated');
```

### Policy 3: User Delete Own Images
```sql
CREATE POLICY "User can delete own images" ON storage.objects
FOR DELETE USING (bucket_id = 'king-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 6: Configure Upload Password (Optional)

To prevent spam uploads, the app includes password protection:

1. **Default Password**: If you don't set `NEXT_PUBLIC_UPLOAD_PASSWORD`, it defaults to `king2024`
2. **Custom Password**: Set your own password in `.env.local`:
   ```bash
   NEXT_PUBLIC_UPLOAD_PASSWORD=your_awesome_password
   ```
3. **Share Password**: Give the password to people you want to allow to upload photos

## Step 7: Test Your Setup

1. Run your development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. Try uploading an image in the gallery section

4. Check your Supabase dashboard → Storage → king-photos to see if the image appears

## Troubleshooting

### ❌ "Unable to load images" Error
- Check that your `.env.local` file has the correct Supabase URL and key
- Make sure the `king-photos` bucket exists and is public
- Verify the storage policies are set up correctly

### ❌ Upload Fails
- Check browser console for error messages
- Ensure the bucket is public
- Verify your Supabase project is active (not paused)

### ❌ Images Don't Display
- Check that the bucket is set to public
- Verify the "Public read access" policy is created
- Make sure image URLs are being generated correctly

## Security Notes

- The `anon` key is safe to use in client-side code
- Images are stored publicly (anyone with the URL can view them)
- For production, consider adding authentication if you want private images

## Next Steps

Once everything is working:
1. Push your code to GitHub
2. Deploy to Vercel
3. Add your environment variables to Vercel's dashboard
4. Your King Countdown app will be live! 🎉

---

**Need Help?** Check the [Supabase Documentation](https://supabase.com/docs) or the error messages in your browser console.