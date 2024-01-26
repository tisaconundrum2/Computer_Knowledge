#!/bin/bash

# Get the directory where the script is located
directory="$(cd "$(dirname "$0")" && pwd)"

# Loop through each folder in the script's directory
for folder in "$directory"/*; do
    if [ -d "$folder" ]; then
        # Change directory to the folder
        cd "$folder"
        
        # Execute the git commands
        git switch dev && git pull
        
        # Return to the original directory
        cd "$directory"
    fi
done
