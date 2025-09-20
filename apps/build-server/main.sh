#!/bin/sh

# Ensure environment variable is set
if [ -z "$GIT_REPOSITORY_URL" ]; then
  echo "Error: GIT_REPOSITORY_URL is not set"
  exit 1
fi

# Clone the repo from the environment variable to build-server/output
git clone "$GIT_REPOSITORY_URL" /app/apps/build-server/output

# Change to build-server directory where local node_modules exists and run
cd /app/apps/build-server
exec bun index.ts