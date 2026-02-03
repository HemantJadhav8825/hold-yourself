#!/bin/bash
set -e

echo "Checking out to main branch..."
git checkout main

echo "Deleting all local branches except main..."
# List branches, filter out main, and delete them
# We use || true to prevent the script from failing if there are no other branches
git branch | grep -v "main" | xargs git branch -D || echo "No other branches to delete."

echo "Git branch cleanup complete!"
