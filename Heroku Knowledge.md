# Heroku

A cloud platform for building, deploying, and managing web applications. This document covers essential Heroku commands and workflows for Node.js applications.

## Prerequisites & Setup

Before deploying to Heroku, ensure you have:
- Node.js installed (`node --version`)
- npm installed (`npm --version`)
- Git installed (`git --version`)
- A Heroku account

### Authentication

`heroku login`
- Opens a web browser for Heroku authentication
- Required before you can create or manage Heroku applications

## Creating Your Application

### Initial Setup

`heroku create`
- Creates a new Heroku app with a randomly generated name
- Adds a `heroku` remote to your Git repository
- Generates a unique URL for your application

### Deploying Your Code

`git push heroku main`
- Deploys your code from the `main` branch to Heroku
- Heroku automatically detects your Node.js application type
- Installs dependencies and starts your app

### Deploy Non-Main Branch

`git push -f heroku HEAD:main`
- Pushes your current branch to Heroku's `main` branch
- Useful when working on feature branches but have a single Heroku app
- The `-f` flag forces the update on the remote

## Process Management

### Viewing Processes

`heroku ps`
- Shows all running processes on your Heroku app
- Displays worker types, status, and resource usage

### Scaling Your App

`heroku ps:scale web=n`
- Scales your web process to `n` number of dynos (containers)
- Example: `heroku ps:scale web=2` runs 2 instances of your app
- Example: `heroku ps:scale web=0` stops the app (useful for pausing free tier apps)

## Viewing Your Application

`heroku open`
- Opens your deployed application in your default web browser
- Uses the URL assigned to your Heroku app

## Monitoring & Debugging

### View Logs

`heroku logs --tail`
- Streams application logs in real-time
- Shows errors, warnings, and general output from your application
- Press Ctrl+C to stop streaming logs

### Full Log History

`heroku logs`
- Displays the full log history (without streaming)
- Useful for debugging past issues

## Application Configuration

### Procfile

The `Procfile` is a text file in your application's root directory that tells Heroku how to start your app.

**Example Procfile:**
```
web: npm start
```

This instructs Heroku to run `npm start` to launch your application.

**Common Procfile Types:**
- `web`: HTTP server (required, receives traffic)
- `worker`: Background processes
- `clock`: Scheduled tasks

### Environment Variables

`heroku config`
- Displays all environment variables for your app
- Shows config variables like database URLs, API keys, etc.

#### Setting Variables

**Option 1: Using the CLI**
```
heroku config:set VARIABLE_NAME=value
heroku config:set TIMES=2
```

**Option 2: Using .env File**
- Create a `.env` file in your project root
- Add your variables: `VARIABLE_NAME=value`
- Heroku reads this file during deployment (with proper setup)

## Local Development

### Running Your App Locally

`heroku local web`
- Runs your application locally using the same configuration as Heroku
- Respects your `Procfile` and environment variables
- Open http://localhost:5000 in your web browser
- Press Ctrl+C to stop the server

**Note:** Ensure all dependencies are installed with `npm install` before running locally.
