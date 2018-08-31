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

## Checking if machine is on AD domain

`sudo domainjoin-cli query`

## Add user to a sudo group
`sudo usermod -aG sudo <user>`

## Find who is part of the sudo group
`getent group sudo`

## Unlock encrypted drive

    udisksctl unlock -b /dev/sdb5
    sudo mkdir /mnt/data
    sudo mount /dev/dm-1 /mnt/data
    
If you run into `mount: unknown filesystem type 'LVM2_member'` try the commands below \
odds are, this is caused by the main OS's drive being similarly named.

    sudo bash
    vgdisplay
    vgrename <VG UUID> new_name
    modprobe dm-mod
    vgchange -ay
    lvscan
    mount /dev/new_name/root /mnt/data/


## Unclean file system

`sudo ntfsfix /dev/sdXY`\
`sudo mount -o rw /dev/sdXY`

## Copy files with progress bar

`rsync -ah --progress <source> <destination>`\
`rsync -rah --progress <source> <destination>  # recursive`

``` 
 -r, --recursive             recurse into directories
 -a, --archive               archive mode; equals -rlptgoD (no -H,-A,-X)
 -h, --human-readable        output numbers in a human-readable format
```

## Copy files

the `.` is a special character that tells cp to copy inside the folder

`cp -anrv dest0/. dest1/`

```
  -a, --archive                same as -dR --preserve=all
  -n, --no-clobber             do not overwrite an existing file (overrides
                                 a previous -i option)
  -R, -r, --recursive          copy directories recursively
  -v, --verbose                explain what is being done
```

## Moves files

`mv -fnv dest0/ dest1/`

```
  -f, --force                  do not prompt before overwriting
  -n, --no-clobber             do not overwrite an existing file
  -v, --verbose                explain what is being done
```

## Timeshift

    sudo apt-add-repository -y ppa:teejee2008/ppa
    sudo apt-get update
    sudo apt-get install timeshift

First of all your `/dev/sdb` isn't partitioned. I am assuming this is the disk you want to mount.

## Formatting and Automounting your drive 

Run `sudo fdisk /dev/sdb` # Note this will erase your data. Be sure that you want to do this.

1. Press <kbd>O</kbd> and press <kbd>Enter</kbd> *(creates a new table)*

2. Press <kbd>N</kbd> and press <kbd>Enter</kbd> *(creates a new partition)*

3. Press <kbd>P</kbd> and press <kbd>Enter</kbd> *(makes a primary partition)*

4. Then press <kbd>1</kbd> and press <kbd>Enter</kbd> *(creates it as the 1st partition)*

5. Finally, press <kbd>W</kbd> *(this will write any changes to disk)*


Okay now you have a partition, now you need a filesystem.

6. Run `sudo mkfs.ext4 /dev/sdb1`

7. Now you can add it to fstab # Using the GUI instead, this is safer. bad alters to `fstab` could result in destroyed system

The GUI solution for me is **gnome-disks**

    sudo gnome-disks
    
![gnome-disks][1]

Then with the configuration button you can "edit mount options", feel free to give the destination of your mount point and it will be saved into the /etc/fstab automatically

![enter image description here][2]


  [1]: http://i.stack.imgur.com/WZeoX.png
  [2]: http://i.stack.imgur.com/h529h.png

# Removing/Uninstalling a Package
    package=<package>
    sudo apt-get remove $package
    sudo apt-get purge $package
    sudo apt-get autoremove 
    dpkg -S /dir/to/original/file

Use this dpkg removes the variable from the terminal so you don't see something like this\
`$ java`
`bash: /usr/bin/java: No such file or directory`


# How to change login background

![image](https://user-images.githubusercontent.com/11879769/43656291-bd8bbf10-9706-11e8-9655-df827d48de0a.png)

    sudo cp PATH/TO/YOUR/IMAGE /usr/share/backgrounds/
    sudo gedit /etc/alternatives/gdm3.css

change

    #lockDialogGroup {
      background: #2c001e url(resource:///org/gnome/shell/theme/noise-texture.png);
      background-repeat: repeat; }

to

    #lockDialogGroup {
      background: #2c001e url(file:///usr/share/backgrounds/<yourpicture>.png);
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center; }
