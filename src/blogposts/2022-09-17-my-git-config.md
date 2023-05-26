---
date: 2022-09-17
title: 'My git aliases and git workflow'
---

When I first started as a dev, I only used the basic commands like `pull`, `fetch`, `add`, `commit`, `merge` and `push` to work with git. I think that you can be highly productive using only these commands. However, after a few years of learning more about branching and commands, I've grown really fond of my git workflow. I really like how flexible it is and how easy it is to make meaningful commits.

## The git aliases

As of today, the aliases of my gitconfig look like this:

```bash
[alias]
        pf = push --force-with-lease
        co = checkout
        wip = !git add -A && git commit -m '[no ci] wip' -n
        rbh = rebase -i origin/head
```

## Aliases

### `pf`, alias for `git push --force-with-lease`

Because I normally rewrite my branches with `git rebase`, I usually have to force push my branches. However, if you share a branch with a colleague and they make some commits on that branch, using `--force` alone risks overwriting those commits. The `--force-with-lease` flag is a safer option which checks the commits on the remote branch first. If there are no new commits, the push will be successful. If there are new commits, the push will fail and you will need to add the new commits from your remote branch to your local branch before pushing.

I've heard of too many bad experiences with `git push --force` alone. This alias makes sure I use `--force-with-lease` as it's more easily accessible (read less characters to type).

### `co`, alias for `checkout`

I mistype checkout _every_ time, so an alias has helped me here.

### `wip`, alias for `!git add -A && git commit -m '[no ci] wip' -n`

I use this alias when I have code that I want to save that is clearly work in progress. This has come in helpful for if I want to share a branch with a colleague quickly, or if I get to the end of the workday and I want to push my work to the remote branch for peace of mind. 

Because I always want my commit messages to be meaningful, I never commit my 'wip' commits to the final branch. I normally rebase my commits clearly before opening my request for review.

There are three parts to this alias.

First, `!` tells git to treat the alias as a shell command. This is from the [documentation for git aliases](https://git-scm.com/docs/git-config#Documentation/git-config.txt-alias).

`git add -A` stages _all_ changes. Compared to `.`, `-A` includes deletions and any directories that may not be included in the current directory where the command is run.

`git commit -m '[no ci] wip' -n` commits the changes to the branch with the message "[no ci] wip". By including `[no ci]`, the branch not trigger any CI pipeline to be run. This is especially useful if I know that my tests will definitely fail because everything is still a work in progress. `-n` will bypass any pre-commit checks if there are any.

I do not recommend using alias if you do not have a reliable CI pipeline which has to run before merging your branch into the main/production branch. The CI and pre-commit checks are there for a reason. Only use this if you will clean up your commits and run through CI eventually.

### `rbh`, alias for `rebase -i origin/head`

This alias triggers the interactive (`-i` flag) rebasing tool, using `origin/head` as the base branch. `origin/head` refers to the tip of the branch on the remote. This command allows me to manage any wip commits, whether that be rewriting their messages, or squashing them with other commits.

## Other useful parts of my config

The following two settings affect the way my `git branch` shows up.

```bash
[branch]
        sort = committerdate
[pager]
        branch = false
```

I never remember the exact names of my branches when they're in an alphabetical list. However, the more recent they are, the more likely they are relevant to me.

I don't use the pager for git branch because I like looking back at the list and copy-pasting git branch names

```bash
[rebase]
        autosquash = true
```

When using interactive rebase, setting autosquash to true automatically reorders and squashes [fixup commits](https://git-scm.com/docs/git-commit#Documentation/git-commit.txt---fixupamendrewordltcommitgt) with the associated commit.

```bash
[push]
        autoSetupRemote = true
```

As of git `2.37.0`, adding this setting will automatically push the current branch to the remote branch with the same name.

