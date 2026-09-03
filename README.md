# Róża's Little Class — setup guide

This guide assumes no coding experience. Follow it top to bottom.

## Part 1 — Set up your Supabase database

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/mozdifpwpscpmexstpio
2. In the left sidebar, click the **SQL Editor** icon.
3. Click **New query**.
4. Open the file `supabase/schema.sql` from this project (in a text editor, or just view it on GitHub once uploaded), copy **all** of its contents, and paste them into the SQL Editor.
5. Click **Run**. You should see "Success. No rows returned."
6. Now create your login. In the left sidebar, click **Authentication** → **Users** → **Add user** → **Create new user**. Enter the email and password you want to use to log into the app. Leave "Auto Confirm User" turned on. Click **Create user**.
7. Back in the **SQL Editor**, click **New query** again. Open `supabase/seed.sql` from this project, copy all of its contents, and paste them in.
8. Find this line near the top:
   ```
   select id into v_user_id from auth.users where email = 'YOUR_EMAIL_HERE' limit 1;
   ```
   Replace `YOUR_EMAIL_HERE` with the exact email you used in step 6 (keep the quote marks).
9. Click **Run**. This loads the five starting lessons, their songs, materials and steps, and the one seeded class record.

## Part 2 — Get your Supabase API keys

1. In the Supabase dashboard, click **Project Settings** (gear icon) → **API**.
2. You'll need two values later: the **Project URL** and the **anon public** key.
   (You've already shared these with me, but you'll re-enter them in GitHub in Part 4.)

## Part 3 — Create the GitHub repository

1. Go to https://github.com and make sure you're signed in (you said you already have an account).
2. Click the **+** icon top-right → **New repository**.
3. Name it `roza-little-class` (any name works — GitHub Pages will use whatever name you pick automatically).
4. Set it to **Private** (recommended, since this is a personal family app) or Public — your choice.
5. Do **not** check "Add a README" — leave it empty.
6. Click **Create repository**.

## Part 4 — Upload the project files

1. On your new repository's page, click **uploading an existing file** (or **Add file → Upload files**).
2. On your computer, open the folder I've given you and select **all files and folders inside it** (including hidden ones like `.github` — if your file browser hides files starting with a dot, see the note below) and drag them all into the GitHub upload box.
3. Scroll down, add a commit message like "Initial upload", and click **Commit changes**.

> **Note on hidden files:** folders starting with a dot (like `.github`) are sometimes hidden by default on Mac/Windows.
> - **Mac:** in Finder, press `Cmd + Shift + .` to reveal hidden files before dragging.
> - **Windows:** in File Explorer, go to View → Show → Hidden items.
>
> If `.github/workflows/deploy.yml` doesn't end up in your repository, the automatic deployment step (Part 6) won't work — check that this file is there before continuing (browse to it on github.com to confirm).

## Part 5 — Add your Supabase keys as GitHub secrets

Your Supabase keys should never be typed directly into code — GitHub has a secure place for them:

1. In your repository on github.com, click **Settings** (top menu of the repo, not your account settings).
2. In the left sidebar, click **Secrets and variables** → **Actions**.
3. Click **New repository secret**.
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://mozdifpwpscpmexstpio.supabase.co`
   - Click **Add secret**.
4. Click **New repository secret** again.
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: (paste the `anon public` key from Part 2)
   - Click **Add secret**.

## Part 6 — Turn on GitHub Pages

1. Still in repository **Settings**, click **Pages** in the left sidebar.
2. Under "Build and deployment" → **Source**, choose **GitHub Actions** (not "Deploy from a branch").
3. That's it — no need to click anything else here.

## Part 7 — Watch it deploy

1. Click the **Actions** tab at the top of your repository.
2. You should see a workflow run called "Deploy to GitHub Pages" in progress (it starts automatically after your upload in Part 4, and again on Part 5/6 if it re-runs). Click it to watch progress. It usually takes 1–3 minutes.
3. Once it shows a green checkmark, go back to **Settings → Pages** — you'll see your live web address at the top, something like:
   `https://yourusername.github.io/roza-little-class/`
4. Open that address and log in with the email/password you created in Part 1.

If the workflow shows a red ✕, click into it to see which step failed — the most common cause is a missing or misspelled secret name from Part 5. Paste me the error text and I'll help you fix it.

## Part 8 — Install it on your phone/iPad

- **iPhone/iPad (Safari):** open the site link, tap the Share icon, tap **Add to Home Screen**.
- **Android (Chrome):** open the site link, tap the ⋮ menu, tap **Add to Home screen** / **Install app**.

It will now open full-screen like a normal app, with the "R" icon on your home screen.

## Making future changes

Any time I update the code for you, I'll give you the changed files. Uploading them again through **Add file → Upload files** on github.com (overwriting the old ones) will automatically trigger a new deployment within a couple of minutes — no other steps needed.
