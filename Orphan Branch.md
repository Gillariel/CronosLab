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
