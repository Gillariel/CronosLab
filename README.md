# CronosLab

This is the main repo for the March's Cronos Lab

# Workshop instructions

* [Presentation Slides](https://drive.google.com/open?id=1G_48oVxW0N2edYSLy051mQ3OxEpVsrtgTiW5BSRQ9EM)
* [Pizza Shop](https://drive.google.com/open?id=1oMc1Wmx1HnXqaoc6Di7H3WcCizVOL_BD9LYfc35WdNo)
* [To Do List](https://drive.google.com/open?id=1SX54k7yfCe8fH1wplAuu8FH5LmB-xk3sgKPk-kVfzJA)
* [Blindtest](https://drive.google.com/open?id=1o3t4IaQ0iYV15Q_9GTNku6q94wRsv3eVnbr37gFnrY0)

# Stubs

Pay attention by working in C#, you have to deploy your apps on Azure which require an Azure account (Not provided by us)
Here is the Stubs available for the workshop :
* [Node JS Webhook](https://github.com/Gillariel/CronosLab/tree/Node_Webhook_Stub)
* [Java Webhook](https://github.com/Gillariel/CronosLab/tree/Java_Webhook_Stub) 
* [C# Webhook](https://github.com/Gillariel/CronosLab/tree/C#_Webhook_Stub) 
* [Python Webhook](https://github.com/Gillariel/CronosLab/tree/Python_Webhook_Stub) 

# Useful Links

* [DialogFlow Docs](https://dialogflow.com/docs/getting-started/basics)
* [DialogFlow Forum](https://productforums.google.com/forum/#!forum/dialogflow)
* [SSML For Google Assistant](https://developers.google.com/actions/reference/ssml)
* [Webhook Definition](https://en.wikipedia.org/wiki/Webhook)

# Workshop Solutions

* [BlindTest Webhook (Node)](https://github.com/Gillariel/CronosLab/tree/Blindtest_Webhook)
* [BlindTest API (Node)](https://github.com/Gillariel/CronosLab/tree/Blindtest_API)
* [To Do List (C#)](https://github.com/Gillariel/CronosLab/tree/C#_ToDo)

# Works with Git Orphan Branch

## Clone

* `git clone -b BranchName https://github.com/_USERNAME_/_ROOT_PROJECT_NAME_.git`	

## New Branch

* Start Cmd or GitBash from the root directory of your project 
* `git init`
* `git remote add origin https://github.com/_USERNAME_/_ROOT_PROJECT_NAME_.git`
* `git checkout --orphan BranchName` 
* `git add .`
* `git commit -m "commitMessage"`
* `git push origin BranchName`

## Push an existing branch from non-git repo

This is maybe not the best solution but it works safely

* `git clone -b BranchName url/to/root/project.git`
* Copy your files from your local non-git project 
* Paste them in the cloned project directory
* `git add .`
* `git add -u` if you have deleted some files
* `git status` to check that all is ok before commit
* `git commit -m "commitMessage"`
* `git push` (No need to specify origin and branchName, you're already in the correct branch)

## Push an existing branch from local git repo

* `git add .`
* `git add -u` if you have deleted some files
* `git status` to check that all is ok before commit
* `git commit -m "commitMessage"`
* `git push` (No need to specify origin and branchName, you're already in the correct branch)
