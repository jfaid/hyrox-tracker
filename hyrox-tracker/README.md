# Hyrox Training Tracker

A shared 24-week Hyrox training program tracker for Simon & Julian.

## Quick Setup (15 minutes)

### Step 1: Set Up Supabase (Free Database)

1. Go to [supabase.com](https://supabase.com) and click "Start your project"
2. Sign up with GitHub (easiest) or email
3. Click "New Project"
   - Name: `hyrox-tracker`
   - Database Password: generate a strong one (save it somewhere)
   - Region: choose closest to you
   - Click "Create new project" (takes ~2 minutes)

4. Once ready, go to **SQL Editor** in the left sidebar
5. Click "New query" and paste this SQL, then click "Run":

```sql
-- Create workouts table
CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  runner TEXT NOT NULL,
  week INTEGER NOT NULL,
  day INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  time TEXT,
  rpe INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(runner, week, day)
);

-- Create benchmarks table
CREATE TABLE benchmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  runner TEXT NOT NULL,
  week INTEGER NOT NULL,
  total_time TEXT,
  avg_split TEXT,
  splits JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(runner, week)
);

-- Enable Row Level Security (but allow all operations for simplicity)
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmarks ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (simple setup for private use)
CREATE POLICY "Allow all operations on workouts" ON workouts FOR ALL USING (true);
CREATE POLICY "Allow all operations on benchmarks" ON benchmarks FOR ALL USING (true);

-- Create indexes for faster queries
CREATE INDEX idx_workouts_runner ON workouts(runner);
CREATE INDEX idx_benchmarks_runner ON benchmarks(runner);
```

6. Go to **Project Settings** (gear icon) → **API**
7. Copy these two values (you'll need them in Step 3):
   - Project URL (looks like `https://xxxxx.supabase.co`)
   - `anon` `public` key (the long string)

### Step 2: Deploy to Vercel (Free Hosting)

1. Go to [vercel.com](https://vercel.com) and click "Sign Up"
2. Sign up with GitHub (recommended)
3. Click "Add New..." → "Project"
4. Click "Import Third-Party Git Repository" at the bottom
5. Paste this URL and click Continue:
   ```
   https://github.com/your-username/hyrox-tracker
   ```
   
   **OR** (easier method):
   
   - Download this project folder
   - Create a new GitHub repository
   - Push the code to GitHub
   - Then import from your GitHub repo in Vercel

### Step 3: Add Environment Variables

In Vercel during project setup (or in Settings → Environment Variables):

1. Add `VITE_SUPABASE_URL` = your Supabase Project URL
2. Add `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
3. Click Deploy

### Step 4: You're Done!

Vercel will give you a URL like `hyrox-tracker.vercel.app`. 

Both you and Julian can:
- Open this URL on your phones
- Add it to your home screen (looks like an app!)
- Track workouts and see each other's progress in real-time

---

## Local Development

If you want to run it locally:

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev
```

---

## Adding to Phone Home Screen

### iPhone
1. Open the URL in Safari
2. Tap the Share button (square with arrow)
3. Tap "Add to Home Screen"
4. Name it "Hyrox" and tap Add

### Android
1. Open the URL in Chrome
2. Tap the three-dot menu
3. Tap "Add to Home screen"
4. Name it "Hyrox" and tap Add

---

## Troubleshooting

**Data not saving?**
- Check your Supabase credentials in Vercel environment variables
- Make sure you ran the SQL to create tables

**Can't see the other person's data?**
- Both of you should be using the same deployed URL
- Data syncs automatically when you refresh

**Need to reset all data?**
In Supabase SQL Editor, run:
```sql
DELETE FROM workouts;
DELETE FROM benchmarks;
```
