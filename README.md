# King Countdown 🐕

A beautiful countdown timer for King the mini hairy sausage dog arriving on October 26th! Built with Next.js, React, and TypeScript.

## Features

- ⏰ **Real-time Countdown Timer** - Shows days, hours, minutes, and seconds until King arrives
- ✨ **Interactive Particle Background** - Beautiful animated particles that respond to mouse interactions
- 📸 **Image Gallery** - Upload and view photos of King with click-to-expand functionality
- 🔒 **Password Protection** - Secure upload system to prevent spam
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🎨 **Modern UI** - Beautiful gradient background with glassmorphism effects

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd king-countdown
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings → API to get your project URL and anon key
   - Create a `.env.local` file in the project root:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_UPLOAD_PASSWORD=your_secret_password
   ```
   - In your Supabase dashboard, go to Storage and create a bucket called `king-photos`
   - Set the bucket to public and configure RLS policies (see SUPABASE_SETUP.md for details)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deploy on Vercel

The easiest way to deploy this app is using Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click!

Or use the Vercel CLI:
```bash
npm i -g vercel
vercel
```

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database and file storage
- **@tsparticles/react** - Particle animations
- **Lucide React** - Icons

## Customization

- **Target Date**: Update the date in `src/components/CountdownTimer.tsx` (currently set to October 26th)
- **Colors**: Modify the gradient background in `src/app/page.tsx`
- **Particles**: Adjust particle settings in `src/components/ParticleBackground.tsx`

Enjoy counting down to King's arrival! 🎉
