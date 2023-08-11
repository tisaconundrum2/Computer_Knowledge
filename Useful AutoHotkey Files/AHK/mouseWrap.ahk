; ------------------ Details ------------------ ;

AppName = MouseWrapper
AppVer = 1.2

; ------------------ Default Settings ------------------ ;

Default_bHWrap = true
Default_bVWrap = false
bShowTip = false
Default_PollTimeMouse = 50
Default_PollTimeDisplay = 2000

; ------------------ Read existing settings if any ------------------ ;

SettingsFile = %AppName%.ini

IfExist %SettingsFile%
{
	; Read Settings
	FileReadLine bHWrap, %SettingsFile%, 1
	FileReadLine bVWrap, %SettingsFile%, 2
	FileReadLine PollTimeMouse, %SettingsFile%, 3
	FileReadLine PollTimeDisplay, %SettingsFile%, 4

	;MsgBox bHWrap : %bHWrap%`nbVWrap : %bVWrap%`nPollTimeMouse : %PollTimeMouse%`nPollTimeDisplay : %PollTimeDisplay%
	if bHWrap <> true
	{
		if bHWrap <> false
		{
			Error = Invalid value on line 1: %bHWrap%
			bHWrap := Default_bHWrap
		}
	}
	
	if bVWrap <> true
	{
		if bVWrap <> false
		{
			Error = %Error%`nInvalid value on line 2: %bVWrap%
			bVWrap := Default_bVWrap
		}
	}
	
	if PollTimeMouse is not integer
	{
		Error = %Error%`nInvalid value on line 3: %PollTimeMouse%
		PollTimeMouse := Default_PollTimeMouse
	}
	else if PollTimeMouse < 10
	{
		Error = %Error%`nInvalid value on line 3: %PollTimeMouse%
		PollTimeMouse := Default_PollTimeMouse
	}
	
	if PollTimeDisplay is not integer
	{
		Error = %Error%`nInvalid value on line 4: %PollTimeDisplay%.
		PollTimeDisplay := Default_PollTimeDisplay
	}
	else if PollTimeDisplay < 100
	{
		Error = %Error%`nInvalid value on line 4: %PollTimeDisplay%.
		PollTimeDisplay := Default_PollTimeDisplay
	}
	
	;MsgBox bHWrap : %bHWrap%`nbVWrap : %bVWrap%`nPollTimeMouse : %PollTimeMouse%`nPollTimeDisplay : %PollTimeDisplay%
	if Error
	{
		MsgBox 262192, %AppName%: Error, %Error%
	}

}
else
{
	; Set Defaults
	bHWrap := Default_bHWrap
	bVWrap := Default_bVWrap
	PollTimeMouse := Default_PollTimeMouse
	PollTimeDisplay := Default_PollTimeDisplay
	
	; Write Defaults
	FileAppend %bHWrap%`n, %SettingsFile%
	FileAppend %bVWrap%`n, %SettingsFile%
	FileAppend %PollTimeMouse%`n, %SettingsFile%
	FileAppend %PollTimeDisplay%`n, %SettingsFile%
	FileAppend `nLine 1: Horizontal Wrapping <true|false>`nLine 2: Vertical Wrapping <true|false>`nLine 3: Mouse Poll-time <milliseconds>`nLine 4: Display configuration Poll-time <milliseconds>, %SettingsFile%
	
	MsgBox 262208,%AppName%: Launch,This is the first time you've launched %AppName%.`nDefault settings loaded. The settings file is located at:`n`n%A_WorkingDir%\%SettingsFile%
}

; ------------------ Tray Icon & Tooltip ------------------ ;

Menu TRAY, Icon, %A_WinDir%\system32\main.cpl,,1
Menu TRAY, Tip, %AppName% v%AppVer%
Menu TRAY, NoStandard
Menu TRAY, Add, &About, MenuINFO
Menu TRAY, Add
Menu TRAY, Add, Mouse: %PollTimeMouse%ms, MenuNULL
Menu TRAY, Disable, Mouse: %PollTimeMouse%ms
Menu TRAY, Add, Disp: %PollTimeDisplay%ms, MenuNULL
Menu TRAY, Disable, Disp: %PollTimeDisplay%ms
Menu TRAY, Add
Menu TRAY, Add, &Tooltip, MenuTTT
Menu TRAY, Add, &X-Wrap, MenuTHW
Menu TRAY, Add, &Y-Wrap, MenuTVW
Menu TRAY, Add, &Pause, MenuPAUSE
Menu TRAY, Add, &Edit, MenuEDIT
Menu TRAY, Add, &Reload, MenuRELOAD
Menu TRAY, Add
Menu TRAY, Add, &Quit, MenuQUIT
Menu TRAY, Default, &About
	
if bShowTip = true
{
	Menu TRAY, Check, &Tooltip
}
if bHWrap = true
{
	Menu TRAY, Check, &X-Wrap
}
if bVWrap = true
{
	Menu TRAY, Check, &Y-Wrap
}

; ------------------ Inner Workings ------------------ ;

CoordMode Mouse, Screen

#SingleInstance force

#Persistent
	SetTimer ScreenUpdate, %PollTimeDisplay%
	SetTimer ScreenWrap, %PollTimeMouse%
return

; ------------------ Tray Menus ------------------ ;

MenuNULL:
return

MenuTTT:
	if bShowTip = true
	{
		bShowTip = false
		Menu TRAY, UnCheck, &Tooltip
		Tooltip
	}
	else
	{
		bShowTip = true
		Menu TRAY, Check, &Tooltip
	}
return

MenuTHW:
	if bHWrap = true
	{
		bHWrap = false
		Menu TRAY, UnCheck, &X-Wrap
	}
	else
	{
		bHWrap = true
		Menu TRAY, Check, &X-Wrap
	}

	; Update File
	FileDelete %SettingsFile%
	FileAppend %bHWrap%`n, %SettingsFile%
	FileAppend %bVWrap%`n, %SettingsFile%
	FileAppend %PollTimeMouse%`n, %SettingsFile%
	FileAppend %PollTimeDisplay%`n, %SettingsFile%
	FileAppend `nLine 1: Horizontal Wrapping <true|false>`nLine 2: Vertical Wrapping <true|false>`nLine 3: Mouse Poll-time <milliseconds>`nLine 4: Display configuration Poll-time <milliseconds>, %SettingsFile%
return

MenuTVW:
	if bVWrap = true
	{
		bVWrap = false
		Menu TRAY, UnCheck, &Y-Wrap
	}
	else
	{
		bVWrap = true
		Menu TRAY, Check, &Y-Wrap
	}

	; Update File
	FileDelete %SettingsFile%
	FileAppend %bHWrap%`n, %SettingsFile%
	FileAppend %bVWrap%`n, %SettingsFile%
	FileAppend %PollTimeMouse%`n, %SettingsFile%
	FileAppend %PollTimeDisplay%`n, %SettingsFile%
	FileAppend `nLine 1: Horizontal Wrapping <true|false>`nLine 2: Vertical Wrapping <true|false>`nLine 3: Mouse Poll-time <milliseconds>`nLine 4: Display configuration Poll-time <milliseconds>, %SettingsFile%
return

MenuINFO:
	MsgBox 262208,%AppName%: Info,%AppName% v%AppVer%`n`nCreated by Paegus (peagus@gmail.com)`n`nUsing AutoHotKey v%A_AhkVersion%`n`nhttp://www.autohotkey.com
return

MenuPAUSE:
	if A_IconTip = %AppName% v%AppVer%
	{
		Menu TRAY, Icon, %A_WinDir%\system32\SHELL32.dll,110,1
		Menu TRAY, Tip, %AppName% v%AppVer%`n    -  PAUSED  -
		Menu TRAY, Check, &Pause
		Pause
	}
	else
	{
		Menu TRAY, Icon, %A_WinDir%\system32\main.cpl,,1
		Menu TRAY, Tip, %AppName% v%AppVer%
		Menu TRAY, UnCheck, &Pause
		Pause
	}
return

MenuEDIT:
	run notepad %A_WorkingDir%\%SettingsFile%
return

MenuReload:
	Reload
return

MenuQUIT:
	ExitApp 0
return

; ------------------ Core Functions ------------------ ;

ScreenUpdate:
	SysGet Monitors, MonitorCount

	iBorderLeft = 0
	iBorderRight = 0
	iBorderTop = 0
	iBorderBottom = 0
	TipString = Monitors...

	Loop, %Monitors%
	{
	    SysGet Monitor, Monitor, %A_Index%
		
		if MonitorLeft < %iBorderLeft%
		{
			;MsgBox %A_Index%'s Left %MonitorLeft% < %iBorderLeft%
			iBorderLeft := MonitorLeft
		}
		
		if MonitorRight > %iBorderRight%
		{
			;MsgBox %A_Index%'s Right %MonitorRight% > %iBorderRight%
			iBorderRight := MonitorRight - 1
		}
		
		if MonitorTop < %iBorderTop%
		{
			;MsgBox %A_Index%'s Top %MonitorTop% < %iBorderTop%
			iBorderTop := MonitorTop
		}
		
		if MonitorBottom > %iBorderBottom%
		{
			;MsgBox %A_Index%'s Bottom %MonitorBottom% > %iBorderBottom%
			iBorderBottom := MonitorBottom - 1
		}

		if bShowTip = true
		{
			TipString = %TipString%`n%A_Index%: %MonitorLeft%`,%MonitorTop% x %MonitorRight%`,%MonitorBottom%
		}
	}
return

ScreenWrap:
	MouseGetPos PosX, PosY
	if bHWrap = true
	{
		if PosX <= %iBorderLeft%
		{
			NPosX := iBorderRight - 1
			MouseMove %NPosX%, %PosY%, 0
		}
		else if PosX >= %iBorderRight% 
		{
			NPosX := iBorderLeft + 1
			MouseMove %NPosX%, %PosY%, 0
		}
	}
	
	if bVWrap = true
	{
		if PosY <= %iBorderTop%
		{
			NPosY := iBorderBottom - 1
			MouseMove %PosX%, %NPosY%, 0
		}
		else if PosY >= %iBorderBottom% 
		{
			NPosY := iBorderTop + 1
			MouseMove %PosX%, %NPosY%, 0
		}
	}

	if bShowTip = true
	{
		ToolTip Boundries...`nX: %iBorderLeft% < %PosX% > %iBorderRight%`nY: %iBorderTop% < %PosY% > %iBorderBottom%`n%TipString%
	}
return

; ------------------ End ------------------ ;