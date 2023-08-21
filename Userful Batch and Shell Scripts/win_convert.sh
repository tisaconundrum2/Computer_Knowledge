#!/bin/bash

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "ffmpeg not found. Please install ffmpeg."
    exit 1
fi

# Create output directory
output_directory="mp4_output"
mkdir -p "$output_directory"

# Convert MKV to MP4 function
convert_to_mp4() {
    mkv_file="$1"
    mp4_file="$output_directory/${mkv_file%.mkv}.mp4"

    if [ ! -f "$mp4_file" ]; then
        ffmpeg -i "$mkv_file" -c:v libx264 -c:a aac -vf "fps=30" "$mp4_file"
        echo "Converted $mkv_file to $mp4_file"
    else
        echo "Skipped $mkv_file as $mp4_file already exists."
    fi
}

# Process MKV files in parallel
for mkv_file in *.mkv; do
    if [ -f "$mkv_file" ]; then
        convert_to_mp4 "$mkv_file" &
    fi
done

# Wait for all background processes to finish
wait

echo "Conversion complete."
