#!/bin/bash

# Build the project
npm run build

# Change directory to ./dist
cd ./dist

# Deploy using liara
liara deploy
