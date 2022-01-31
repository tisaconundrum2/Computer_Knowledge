@echo off
for %%i in (*.*) do (
	if not exist %%~xifile md .dotFiles\%%~xifile
)
for %%i in (*.*) do (
	if "%%i" NEQ "organizeFiles.bat" move "%%i" ".dotFiles\%%~xifile"
)
