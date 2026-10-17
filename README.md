# Morning Brief – Android app

Free. Fetches live data on the phone (no server, no login).

## Get the APK (about 10 minutes, all in the browser)
1. Create a free account at github.com and click **New repository**. Name it `morning-brief`, set it to **Private**, click **Create repository**.
2. On the new repo page click **uploading an existing file**. Drag in everything from this folder: `www`, `package.json`, `capacitor.config.json`, `.gitignore`, and the `.github` folder. Click **Commit changes**.
   - If `.github` doesn't upload (hidden folders are sometimes skipped): click **Add file > Create new file**, type `.github/workflows/build-apk.yml` as the name, paste the contents of that file, and commit.
3. Click the **Actions** tab. A run called "Build APK" starts by itself (if asked, click "I understand my workflows, go ahead and enable them"). Wait about 5 minutes for the green tick.
4. Open the finished run, scroll to **Artifacts**, and download **morning-brief-apk**. Unzip it to get `app-debug.apk`.
5. Send the APK to your phone (email, Drive, USB). Open it on the phone and allow "Install unknown apps" when asked.

## Using it
- Opens with the last saved brief, refreshes itself if older than 3 hours, and has a Refresh button.
- Tap a section title to collapse it. The gear lets you set your country code and an optional free YouTube API key.
- X, GitHub trending and similar sources are scraped and can occasionally show "No data"; the rest keeps working.
