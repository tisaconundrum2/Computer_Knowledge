import os
import sys
import time


def get_directory_state(directory):
    """Get the set of all files in a directory."""
    files = set()
    for root, _, filenames in os.walk(directory):
        for filename in filenames:
            filepath = os.path.relpath(
                os.path.join(root, filename), directory
            )
            files.add(filepath)
    return files


def print_changes(prev_state, current_state):
    """Print added and removed files."""
    added = current_state - prev_state
    removed = prev_state - current_state

    if added:
        print("Added:")
        for item in sorted(added):
            print(f"  + {item}")

    if removed:
        print("Removed:")
        for item in sorted(removed):
            print(f"  - {item}")


def monitor_directory(directory):
    """Monitor a directory for file changes."""
    prev_state = get_directory_state(directory)

    while True:
        time.sleep(1)
        current_state = get_directory_state(directory)
        if current_state != prev_state:
            print_changes(prev_state, current_state)
            prev_state = current_state


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <directory>")
        sys.exit(1)

    monitor_directory(sys.argv[1])
