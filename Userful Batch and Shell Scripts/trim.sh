#!/bin/bash

if [ $# -lt 3 ]; then
  echo "Usage: $0 input_file start_time end_time"
  exit 1
fi

input_file="$1"
start_time="$2"
end_time="$3"
output_file="${input_file%.*}_ALTERED.${input_file##*.}"

ffmpeg -ss "$start_time" -to "$end_time" -i "$input_file" "$output_file"
echo "Altered video saved as: $output_file"
