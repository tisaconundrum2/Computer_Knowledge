::===========================================
::Author: Nicholas Finch
::Date Made: 2007
::Creative Commons License: Attribution
::Leave these credits here
::Version 6.24 (Stand alone)
::This version of Imatari does not require
::any dependencies 
:: What's in this Version?
:: []Consolidated the intermediary files
:: they are all now a part of Imatari.
:: []Real Loading screen.
:: []Optimized drive comparison in :existnot
:: []Edit to Error readout
::===========================================

:: ============== Program Start ================
mode 100, 10
color 0a
echo off
cls
set load=
set/a loadnum=0
md .\bat >nul
goto start

:wrong
    echo ERROR: Slash after the colon
	ping localhost -n 1 >nul
	echo Please erase the slash after the colon
	ping localhost -n 3 >nul
	pause
	cls
goto existnot

:start
if not exist .\temp md .\temp
title Imatari's Mmicus -=-version 6.24-=-

cls
echo IT IS HIGHLY RECOMMENDED THAT YOU DON'T PLAY WITH THE FILES THAT ARE LOADED WITH THIS PROGRAM!

set /p question=Would you like to make a new directory? (y/n)

if %question%==y goto y
if %question%==n goto n
if %question% NEQ n if %question% NEQ y echo Please use y or n as an answer. && ping localhost -n 3 >nul && goto start


:y
echo please name the directory (C:\test E:\temp)
set /p directory=


md "%directory%"
echo you created: %directory%
pause


:n
set /p existingfiles=Do you have similar files between these two directories? (y/n)
if %existingfiles%==y goto exist
if %existingfiles%==n goto existnot
if %existingfiles% NEQ n if %existingfiles% NEQ y echo Please use y or n as an answer. && ping localhost -n 3 >nul && goto n


:exist
set /p yes_no=Do you wish to copy on top of those current files? (y/n)
	if %yes_no% NEQ n if %yes_no% NEQ y echo Please use y or n as an answer. && ping localhost -n 3 >nul /t 3 && goto exist
:existnot
cls
echo please set a letter or destination (C:, D:\test\temp, E:\you get the idea)
echo if you are doing a letter write it as this "C:" the slash is already made for you.
echo -----

set list=q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m,Q,W,E,R,T,Y,U,I,O,P,A,S,D,F,G,H,J,K,L,Z,X,C,V,B,N,M
:: set the drive1 variable
set /p drive1=destination 1 (transmitting): 
(for %%i in (%list%) do (
	if %drive1% == %%i:\ call :wrong
))
:: set the drive2 variable
set /p drive2=destination 2  (recieving)  : 
(for %%j in (%list%) do (
	if %drive2% == %%j:\ call :wrong
))

echo transmitting %drive1% to %drive2%


del /f/s .\temp\test.txt
del /f/s .\test.txt
del /f/s .\bat\*.bat
del /f/s .\Commander.bat




dir /b/o/w/a:d "%drive1%\" > .\test.txt
pause



::set2
::note intermidiary files are just randomizer file makers... just ignore them

echo off
cls




	
	if %existingfiles%==n goto intermedy
	if %yes_no%==y goto intermedy
	if %yes_no%==n goto intermedn

	

:intermedy

set /p files= < .\test.txt
call :intermediaryy

del .\temp\test.txt
call :intermediary
:: move the temp test txt file until all the things inside it are gone.
if exist ".\temp\test.txt" (xcopy /e/c/h/y ".\temp\test.txt" ".\") else (goto end)

goto intermedy
:end

echo now starting the copying process
echo xcopy "%drive1%\" "%drive2%\" >> .\bat\primeset.bat
echo exit >> .\bat\primeset.bat
echo start /MIN /B .\primeset.bat START >> .\Commander.bat
echo exit >> .\commander.bat
start .\Commander.bat

	exit
	pause





:intermedn

set /p files= < .\test.txt
call :intermediaryn

del .\temp\test.txt
call :intermediary

if exist ".\temp\test.txt" (xcopy /e/c/h/y ".\temp\test.txt" ".\") else (goto end)


goto intermedn
:end

echo now starting the copying process
echo xcopy "%drive1%\" "%drive2%\" ^<.^\n.txt >> .\bat\primeset.bat
echo exit >> .\bat\primeset.bat
echo start /MIN /B .\primeset.bat START >> .\Commander.bat
echo exit >> .\commander.bat


call Commander.bat

::The below is just some stuff from the past, that I tried to load into here. It is not possible to input this.

::Loading screen subroutine
:Loading2
	set load=%load%[]
	cls
	echo.
	echo Loading... Please Wait...
	echo -----------------------------------------------------
	echo %load% 
	echo -----------------------------------------------------
	set/a loadnum=%loadnum% +1
	if %loadnum%==20 set/a loadnum = 0
	rem You can set the number of ()'s as whatever you rem want but remember: in your "loading box" you rem need 2 spaces for every () because "()" takes up rem 2 spaces. The above box has 40 spaces, so rem twenty repeats, adding 1 () every repeat.
goto :eof



:: ================= Subroutines ===================	
	
	
:intermediary	
	:: ===============================================
	:: Author Nicholas Finch
	:: This is the delete the first line of test.txt part of the program
	:: It will allow the parsing of file names to be organized into their
	:: respective batch files
	::
	:: ===============================================

	@echo off > int.dll & setLocal enableDELAYedeXpansion
	set /a S=1
	set N=
	for /f "tokens=* delims= " %%a in (test.txt) do (
		set /a N+=1
		call :Loading2
		if !N! neq !S! (
		>> .\temp\test.txt echo.%%a)
	)
goto :eof

:intermediaryn
	:: ===============================================
	:: This is the "no" half of the copying process
	:: It will copy over all files no matter what.
	:: 
	:: ===============================================

	echo CD /D .\bat >> .\Commander.bat
	@echo off & setLocal EnableDELAYedeXpansion
	:1
		set S=qwertyuiopasdfghjklzxcvbnm
		set N=10
		set C=

		for /L %%a in (1 1 !N!) do (
		  set /a P=!random!%%62
		  call :sub1 !P!
		)

		echo md "%drive2%\%files%" >> .\bat\!C!set.bat
		echo xcopy ^/e^/c^/h "%drive1%\%files%" "%drive2%\%files%" ^< .^\n.txt >> .\bat\!C!set.bat
		echo exit >> .\bat\!C!set.bat
		echo start /MIN /B .\!C!set.bat START >> .\Commander.bat

	goto :eof

	:sub1
	  set C=!C!!S:~%1,1!
	goto :eof
goto :eof


:intermediaryy
	:: ===============================================
	:: This is the "yes" half of the copying process
	:: It will copy over all files no matter what.
	:: 
	:: ===============================================


	echo CD /D .\bat >> .\Commander.bat
	@echo off & setLocal EnableDELAYedeXpansion
	:1
		set S=qwertyuiopasdfghjklzxcvbnm
		set N=10
		set C=


		for /L %%a in (1 1 !N!) do (
		  set /a P=!random!%%62
		  call :sub1 !P!
		)

		echo md "%drive2%\%files%" >> .\bat\!C!set.bat
		::TODO finish the exclusion program
		echo xcopy /e/c/h/y "%drive1%\%files%" "%drive2%\%files%" >> .\bat\!C!set.bat	
		
		echo exit >> .\bat\!C!set.bat
		echo start /MIN /B .\!C!set.bat START>> .\Commander.bat
	goto :eof

	:sub1
	  set C=!C!!S:~%1,1!
	goto :eof
goto :eof