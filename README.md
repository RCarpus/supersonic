# supersonic
 fined-tuned-ear-training

## Deploying to Heroku
Push all changes to the heroku-api branch on Github. This branch should not include the password info for the database connection, but should use an environment variable.
In powershell, navigate to supersonic/server.  
Run `git subtree push --prefix server heroku heroku-api:master`