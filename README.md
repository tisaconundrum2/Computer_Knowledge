# Linux_Knowledge
Just some knowledge for reoccuring linux stuff 

## Getting out of TTY virtual console

<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>F1</kbd> to <kbd>F6</kbd> are the virtual consoles provided by the `getty`/`agetty` programs. 
<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>F7</kbd> is the console where your X server is running. The GUI (Gnome/KDE or any other) runs over X.
So to get back into your GUI window manager: type: \
<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>F7</kbd> or \
<kbd>Alt</kbd>+<kbd>F7</kbd> or \
<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>F8</kbd><br>

## Logging out a user 

`pkill -KILL -u <user>`

## Shutdown Linux

`init 0` \
`shutdown` \
`halt`

## Unlock encrypted drive

`udisksctl unlock -b /dev/sdb5`\
`sudo mkdir /mnt/data`\
`sudo mount /dev/dm-1 /mnt/data`

## Unclean file system

`sudo ntfsfix /dev/sdXY`\
`sudo mount -o rw /dev/sdXY`

## Copy files with progress bar

`rsync -ah --progress <source> <destination>`
`rsync -rah --progress <source> <destination>  # recursive`
