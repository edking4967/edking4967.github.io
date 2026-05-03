---
layout: default
title: Self-Hosting Quill on PythonAnywhere | Edward King
---

<section class="writeup-section" markdown="1">

# Self-Hosting Quill on PythonAnywhere

PythonAnywhere's free tier is a good fit for Quill: you get a persistent server, HTTPS out of the box, and a simple WSGI-based deployment model. The one constraint is that the free tier has no Node.js, so you can't build the React frontend on the server. This guide handles that by building locally and committing the build to the repo.

---

## What you'll need

- A [PythonAnywhere](https://www.pythonanywhere.com) account (free tier is fine)
- Git installed locally
- The `quill` repo cloned and working on your machine
- A GitHub (or other Git hosting) account

---

## Step 1: Build the frontend locally

Vite is configured to write the build output directly into `backend/dist/`, where Flask expects to find it.

```bash
cd frontend
npm install
npm run build
```

Add the build to your commit:

```bash
git add backend/dist
git commit -m "Build frontend"
git push
```

Do this every time you change frontend code before deploying.

---

## Step 2: Set up PythonAnywhere

Log in to PythonAnywhere and open a **Bash console** from the Dashboard.

Clone your repo:

```bash
git clone https://github.com/yourusername/quill.git
```

Create a virtual environment and install dependencies:

```bash
cd quill/backend
python3 -m venv venv
source venv/bin/activate
pip install flask flask-cors werkzeug python-dotenv
```

---

## Step 3: Create your .env file

In the `backend/` directory, create a `.env` file. This file is gitignored — it never leaves the server.

```bash
nano .env
```

Add:

```
SECRET_KEY=pick-a-long-random-string-here
ALLOWED_ORIGINS=https://yourusername.pythonanywhere.com
```

Replace `yourusername` with your actual PythonAnywhere username. The `SECRET_KEY` can be anything long and random — it signs your session cookies, so keep it private.

---

## Step 4: Configure the WSGI file

In the PythonAnywhere Dashboard, go to **Web** and click **Add a new web app**. Choose:

- **Python version**: the one that matches your virtual environment (Python 3.x)
- **Framework**: Manual configuration

Once created, click the link to edit the **WSGI configuration file**. Replace everything in it with:

```python
import sys
import os

project_home = '/home/yourusername/quill/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Load .env
from dotenv import load_dotenv
load_dotenv(os.path.join(project_home, '.env'))

from app import app as application
```

Replace `yourusername` with your PythonAnywhere username.

---

## Step 5: Set the virtualenv path

Still in the Web tab, find the **Virtualenv** section and enter the path to your virtual environment:

```
/home/yourusername/quill/backend/venv
```

---

## Step 6: Reload and test

Click **Reload** at the top of the Web tab. Visit `https://yourusername.pythonanywhere.com` — you should see Quill's splash screen.

If something is broken, click on the **Error log** link in the Web tab. The most common issues:

- **ModuleNotFoundError** — the virtualenv path is wrong, or you forgot to install a package
- **500 on all routes** — check that the WSGI file path to `quill/backend` is correct
- **Blank page, no API errors** — the `backend/dist/` folder is missing; run the build step and push again

---

## Deploying updates

When you make backend changes:

```bash
# On PythonAnywhere, in a Bash console:
cd ~/quill
git pull
# Then hit Reload in the Web tab
```

When you make frontend changes:

```bash
# Locally:
cd frontend
npm run build
git add backend/dist
git commit -m "Build frontend"
git push

# On PythonAnywhere:
git pull
# Hit Reload in the Web tab
```

---

## Notes on the free tier

- **24-hour inactivity cutoff**: Free PythonAnywhere web apps go to sleep after 3 months of no visitors, but a daily visitor keeps them alive. This isn't a problem for personal use.
- **CPU seconds**: The free tier gives you a limited CPU budget per day. Quill's API calls are fast and cheap; you're unlikely to hit this limit.
- **No background tasks**: Quill doesn't need any. Everything is triggered by HTTP requests.
- **HTTPS**: PythonAnywhere provides HTTPS automatically on the `.pythonanywhere.com` subdomain. No certificate setup required.
- **Database location**: `quill.db` lives in `backend/` on the server and is not committed to git. Back it up occasionally if your data matters — you can download it from the PythonAnywhere Files tab.

</section>
