import os
import sys
import time

def get_directory_state(directory):
    """Get the state of the directory."""
    directory_state = set()
    for root, _, files in os.walk(directory):
        for file in files:
            filepath = os.path.relpath(os.path.join(root, file), directory)
            directory_state.add(filepath)
    return directory_state

def print_difference(prev_state, current_state):
    """Print the difference between previous and current directory states."""
    added = current_state - prev_state
    removed = prev_state - current_state

    if added:
        print("Added:")
        for item in added:
            print(f"+ {item}")

    if removed:
        print("Removed:")
        for item in removed:
            print(f"- {item}")

def monitor_directory(directory):
    """Monitor the directory for changes."""
    prev_state = get_directory_state(directory)
    
    while True:
        time.sleep(1)
        current_state = get_directory_state(directory)
        print_difference(prev_state, current_state)
        prev_state = current_state

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python diff_check.py <directory>")
        sys.exit(1)
        
    directory_to_monitor = sys.argv[1]
    monitor_directory(directory_to_monitor)
