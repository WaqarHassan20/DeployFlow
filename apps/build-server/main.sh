#!/bin/sh

# Ensure environment variable is set
if [ -z "$GIT_REPOSITORY_URL" ]; then
  echo "Error: GIT_REPOSITORY_URL is not set"
  exit 1
fi

echo "Cloning repository: $GIT_REPOSITORY_URL"

# Clone the repo from the environment variable to build-server/output
git clone "$GIT_REPOSITORY_URL" /home/app/apps/build-server/output

if [ $? -ne 0 ]; then
  echo "Error: Git clone failed"
  exit 1
fi

echo "Git clone successful, starting build process..."

# Change to build-server directory where local node_modules exists and run
cd /home/app/apps/build-server
exec bun index.ts