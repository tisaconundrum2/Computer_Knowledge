# Heroku

```
 1016  heroku login
 1017  node --version
 1018  npm --version
 1019  git --version
 1020  cd ..
 1021  git clone https://github.com/heroku/node-js-getting-started.git
 1022  cd node-js-getting-started
 1023  heroku create
 1024  git branch -all
 1025  git branch --all
 1026  git push heroku main
 1027  heroku ps:scale web=1
 1028  heroku open
 1029  heroku logs --tail
 1030  heroku logs --tail
 1031  heroku logs --tail
 1032  ls
 1033  cat Procfile
 1034  heroku ps
 1035  heroku ps:scale web=0
 1036  heroku open
 1037  heroku ps:scale web=1
 1038  npm install
 1039  ls -al
 1040  git status
 1041  git add .
 1042  git commit
 1043  git branch
 1044  git push heroku main
```

## Heroku Login

`heroku login` 
to Login via the web

## Heroku Create

`heroku create` 
to Create a new heroku repo instance

## Scaling your App

`heroku ps:scale web=n` 
to scale to `n` number of instances of your application

## Heroku Open

`heroku open`
to open your instance on the web

## Procfile

Use a Procfile, a text file in the root directory of your application, to explicitly declare what command should be executed to start your app.

`web: npm start`
Example line that could be in the Procfile specifying how to start your app

## Run Locally

`herko local web`
Open http://localhost:5000 with your web browser. You should see your app running locally.

## Heroku Local Variables

`heroku config`
will output your environment variables.

To set them you can
* Change the contents of the `.env` file
* `heroku config:set TIMES=2

## Push to Heroku Dev

This is a way to get your current branch to Main, even if you aren't actually on the Main branch locally.
This is great if you're running separate branches, but a single Heroku App
`git push -f heroku HEAD:main`
