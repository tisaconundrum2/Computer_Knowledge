#!/bin/bash

cd "$(dirname "$0")"
for f in *\ *; do mv "$f" "${f// /_}"; done

INPUT_DIR="."

# Define a function to process each file
process_file() {
    file="$1"
    base_name=$(basename "$file" .mov)
    
    # Convert MKV to MP4 using FFmpeg
    ffmpeg -i "$file" -c:v libx264 -c:a aac -vf "fps=12" "${base_name}.mp4"
    # ../jumpcutter/bin/python3 ../jumpcutter/jumpcutter.py --input_file "${base_name}.mp4" --frame_rate 30
}

# Export the function so it can be used by xargs
export -f process_file

# Find all .mov files and process them in parallel using xargs
find "$INPUT_DIR" -name "*.mov" -print0 | xargs -0 -n 1 -P "$(sysctl -n hw.ncpu)" bash -c 'process_file "$@"' _
