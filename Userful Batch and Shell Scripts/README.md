# Welcome Script Kiddy

Here you will find an amalgamation of several Scripts that I found useful or I've built in the past.

## Imataris Mmicus 6.23.bat

This is an old batch script that I made back in 2007. I highly do not recommend running it on your system as it is very inefficient.
The program utilizes Xcopy to copy a bunch of files into another directory. Nothing super fancy, but it was certainly fancy to me at the time. The area where it is very inefficient is where it opens several programs to run a copy.

Here's a quick description made by chatGPT on why it sucks.

The original script's approach to multiprocessing isn't truly multiprocessing. Instead, it's attempting to simulate concurrency by running multiple `xcopy` commands in succession, each in its own command-line window. Here are the reasons this approach is inefficient:

1. **Sequential vs. Concurrent**: The batch file is designed to run commands sequentially. While the `start` command can launch multiple command-line windows, doing this with file operations doesn't always lead to faster operations. Depending on the filesystem, disk I/O, and other operations on the computer, launching many simultaneous `xcopy` commands could lead to competition for resources and even slow down the copy process.

2. **Overhead**: Each call to the `start` command to launch a new command-line window has overhead. Launching a new process involves system calls and memory allocation. This overhead can add up when done repeatedly, especially if the system is already under load.

3. **No Control**: Launching multiple processes without proper management means you have no control over how many run at once or their lifecycles. This can lead to system resource saturation.

4. **Disk I/O**: One of the main bottlenecks in file copying operations is disk I/O. If the source and destination are on the same disk, running multiple copy operations can result in the disk's read/write head constantly moving back and forth, leading to thrashing. This can drastically slow down the entire process compared to a single, well-managed file copy operation.

5. **Error Handling**: The script doesn't have any robust error handling in place. If one of the copy processes encounters an error, it might not be immediately apparent, especially if multiple command-line windows are launching and closing rapidly.

True multiprocessing would involve breaking the task into parallelized chunks managed by a single system or process, which is beyond the capability of batch scripting. Modern scripting languages, such as Python or PowerShell, have libraries and functions that handle true parallel and concurrent operations, making them more suitable for this kind of task.


## mac_convert.sh

A simple multithreaded script that converts a bunch of MOV files to MP4 had a frame rate of 12.

## organizeFiles.bat

A simple batch script that will automatically organize all your files according to their extension.

## organizeFiles.sh

Also the same script but it's done in bash.

## xNetwork.bat
### startNetwork.bat
### stopNetwork.bat

In Windows 7 there is a way to turn off and turn on the ad-hoc mode for your network adapter. This would essentially give you the ability to turn your computer into an access point or hotspot. I used to use this script extensively back in college in order to give myself a wireless access point. Great script for getting past the firewall that was set up on the campus's network. 😂