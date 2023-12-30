#!/usr/bin/env bash
# This script opens a pull request with the changes in the current branch
# The GITHUB_ environment variables are provided by GitHub Actions
# See https://docs.github.com/en/actions/reference/environment-variables

set -e
branch_name=$1
title=$2
# https://css-tricks.com/git-pathspecs-and-how-to-use-them/
path_spec=$3

changes=$(git status --porcelain=v1 2>/dev/null "${path_spec}" | wc -l)

if [ $changes -eq 0 ]; then
  echo "No changes detected, won't open a PR."
  exit 0
fi

git config user.name "Pest Control"
git config user.email edb@openartmarket.com
git add "${path_spec}"
git commit -m "Automated dependency upgrades"
git push -f origin ${GITHUB_REF_NAME}:$branch_name

PR=$(gh pr list --head $branch_name --json number -q '.[0].number')
if [ -z $PR ]; then
  # Only open a PR if the branch is not attached to an existing one
  pr_url=$(gh pr create \
    --head ${branch_name} \
    --title "${title}" \
    --body "Full log: https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}")

  gh pr merge --auto --merge "${pr_url}"
else
  echo "Pull request for ${branch_name} already exists, won't create a new one."
fi