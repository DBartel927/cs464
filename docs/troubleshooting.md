# Troubleshooting Guide

This guide covers common problems that can come up while setting up, running, or contributing to the CS464 project.

Use this guide if something does not work the way the normal instructions describe.

## Node or npm is not recognized

The project uses Node.js and npm. To check whether they are installed, run:

node -v
npm -v

If either command is not recognized, Node.js may not be installed correctly.

If both commands print version numbers, Node and npm are installed.

## The app will not start

To run the project locally, use:

npm run dev

If the app does not start, check the terminal output first. Next.js will usually print an error message that points to the problem.

Common things to check:

- Your Node.js version is installed correctly
- Docker Desktop is running
- Supabase started correctly
- Your environment variables are set up correctly

## Docker or Supabase is not working

The project uses Supabase for local database work. Supabase needs Docker to run locally.

If Supabase does not start, check these first:

- Docker Desktop is installed
- Docker Desktop is currently running

To start the local database, run:

npm run db:start

To check Supabase status, run:

npm run db:status

If you are setting up the database for the first time, run:

npm run db:setup

## The page loads, but data is missing

If the app starts but the page is missing data, the problem may be with Supabase or the seed data.

Try checking:

- Supabase is running
- The database was seeded successfully
- There are no errors in the terminal
- There are no errors in the browser console

You can try seeding the database again with:

npm run db:seed

## Port 3000 is already in use

The app usually runs at:

http://localhost:3000

If port 3000 is already being used, Next.js may ask to use a different port.

You can either:

1. Accept the new port shown in the terminal, or
2. Stop the other program using port 3000 and run the project again

## Git says you have uncommitted changes

If Git will not let you switch branches or pull current code, check your status:

git status

If you want to keep your changes, commit them:

git add .
git commit -m "Describe your changes"

Then try switching branches or pulling again.

## You accidentally worked on `main`

The project instructions say not to work directly on `main`.

If you accidentally made changes on `main`, you can create a new branch from your current work:

git checkout -b assignmentX/issueY

Replace `assignmentX/issueY` with the correct branch name for your assignment and issue.

After that, continue committing and pushing from the new branch.

## Your branch is behind the class repository

If your branch or fork is out of date, first switch back to `main`:

git checkout main

Then pull the latest changes from the class repository:

git pull upstream main

After that, create a new branch for your work.

## Pull request is pointing to the wrong branch

When creating a pull request, double-check these settings:

- Base repository: `danwhite-osucascades/cs464`
- Base branch: `main`
- Head repository: your fork
- Compare branch: your assignment branch

## Before asking for help

Before asking someone for help, try to collect:

1. The command you ran
2. The full error message
3. Your operating system
4. The terminal you are using, such as Git Bash, WSL, PowerShell, or Terminal
5. The documentation step you were following

This makes it much easier for someone else to understand what happened and help you fix it.