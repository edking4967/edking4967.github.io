---
layout: default
title: Getting Started with Quill | Edward King
---

<section class="writeup-section" markdown="1">

# Getting Started with Quill

Quill is a writing progress tracker built for long-form projects. If you've ever found yourself with a 90,000-word novel to write and no idea how fast you're actually moving, Quill is for you.

This post walks through everything from creating an account to reading your first heatmap.

---

## Try it first

Before you sign up, visit the live app and click **Try the demo**. This loads a fully working version of Quill with fake data — no account needed, nothing saved. It's a good way to get a feel for the interface before committing.

---

## Creating an account

Click **Sign In / Create Account** on the splash screen. Enter an email and password (minimum 6 characters). That's it — no email verification, no OAuth, just a username and password. Your data lives in a private database tied to your account.

---

## Your first project

After logging in you'll see an empty dashboard. Quill organizes everything by **project** — a project is any long-form work with a word count goal.

Go to the **Projects** tab and fill in:

- **Title** — the name of whatever you're writing
- **Target words** — your total word count goal (defaults to 80,000 — a typical novel)
- **Deadline** — optional; shows up on the dashboard so you remember it exists

Click **Add Project**. You'll be taken to the dashboard, which is now showing that project.

---

## Logging a session

A "session" is any block of time you spent working on a project. Switch to the **Log Session** tab.

### Using the timer

The session form opens in timer mode by default. Click **Start session** when you sit down to write. Click **Pause** if you take a break. When you're done, click **End session** — the timer resets and the elapsed time (in minutes) fills in automatically.

### Logging manually

If you forgot to run the timer, or you're adding a session from yesterday, click the **Manual** tab and type the duration in minutes.

### Filling in the rest

- **Project** — which project this session belongs to
- **Date** — defaults to today, but you can back-date sessions
- **Primary Activity** — what you were actually doing:
  - **Writing** — new words on the page
  - **Editing** — revising existing material
  - **Brainstorming** — planning, outlining, thinking on paper
  - **Research** — reading, fact-checking, interviews
- **Words written** — the net new words added in this session (leave at 0 for editing sessions if you didn't gain words)
- **Notes** — anything you want to remember about this session

Click **Log Session**. You'll see a "Session recorded" confirmation and be taken back to the dashboard.

---

## Reading the dashboard

The dashboard is the main view for a single project. At the top you can switch between projects if you have more than one.

### Stat cards

Four numbers at a glance:

- **Total Words** — all the words you've logged for this project, and how many remain to your target
- **Total Time** — total hours and minutes logged
- **This Week** — words and time in the current calendar week
- **Completion** — a percentage, and the count of words left to write

### Progress bar

A simple visual of total logged words vs. your target. If you set a deadline, it appears here too.

### Heatmap

A GitHub-style grid of the last 16 weeks. Each cell is a day; darker amber means more words written that day. Hover over any cell to see the exact date and word count.

If you wrote nothing on a given day, the cell is a pale background. If you wrote a lot, the cell is a deep amber. The scale is relative to your personal best day, so even a 200-word session will show up if that's your biggest day.

---

## History tab

The **History** tab shows stats across all your projects combined: all-time word count, all-time time logged, total number of sessions, and a heatmap that merges every project into one grid.

This is useful for tracking your overall writing habit regardless of what project you're on.

---

## Streak counter

If you've written (i.e., logged at least one session with a positive word count) on consecutive calendar days ending today, you'll see a streak counter in the header — for example, `7d streak`. The streak resets if you miss a day.

---

## Tips

**Log editing sessions too.** Setting the activity to "Editing" and leaving words at 0 still builds your time total and heatmap — which matters if you spend weeks in revision.

**Back-date freely.** Quill doesn't care when you log; it only cares about the date you assign to each session. If you wrote 1,200 words last Thursday and forgot to log it, go ahead and add it with Thursday's date.

**Use notes.** Even a single sentence — "got stuck at the chapter break, tried a POV switch" — is enormously useful when you look back months later.

**Multiple projects.** If you're juggling a novel and a short story collection, add both. The dashboard switches between them instantly and the History tab aggregates everything.

</section>
