## Get One Note to screenshot with Windows + S Shortcut Key

Copy the following command and then paste it into the command line. Press Enter.

```
reg.exe add HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced /v DisabledHotkeys /t REG_SZ /d S /f
```

Reboot your computer and OneNote screen clipping shortcut key should resume to work.
