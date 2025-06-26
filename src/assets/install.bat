@echo off
cd /d "%~dp0"  REM set current directory to the location of the batch file
echo path1: %CD%
setlocal enabledelayedexpansion

echo %~dp0files\node-v20.12.2-x64.msi
"%~dp0files\node-v20.12.2-x64.msi"
echo %~dp0files\gateway.exe
"%~dp0files\gateway.exe"

echo path2: "%~dp0EasyBiometric"
sc query "ServiceName"
set "targetDirectory=C:\Program Files\EasyBiometric"
set "ServiceName=easybiojsserver.exe"


REM Check if the service is running
sc query "%ServiceName%" | findstr /C:"STATE" | findstr /C:"RUNNING" > nul
if errorlevel 1 (
    echo The service "%ServiceName%" is not running.
    REM Continue with your script here
) else (
    echo ERROR: The service "%ServiceName%" is already running.
    pause
    exit /b 1
)


if not exist "%targetDirectory%" (
    mkdir "%targetDirectory%"
    echo Directory created: %targetDirectory%
) else (
    echo Directory already exists: %targetDirectory%
)
xcopy "%~dp0files\EasyBiometric" "%targetDirectory%" /E /H /C /I
C:
cd "C:\Program Files\EasyBiometric"

REM setting base url
set fullPath=C:\Program Files\EasyBiometric\.env
set varName=baseURL
set /p varValue="Enter the port number added while installing gateway(if given empty port will 80): "
pause
if not defined varValue set varValue=80
set formattedValue='http://127.0.0.1:%varValue%/ISAPI/'
echo.>> "!fullPath!"
echo !varName!=!formattedValue! >> "!fullPath!"
echo Variable !varName! with value !varValue! has been saved to !fullPath!.
call npm install
rem Check if the installation was successful
if errorlevel 1 (
    echo Failed to install Node.js modules. Exiting.
    exit /b 1
)

node install_service.js

REM Define the URL and shortcut name
set "URL=http://127.0.0.1:8001"
set "ShortcutName=Easybiometric"

REM Get the Desktop path for the current user
set "DesktopPath=%USERPROFILE%\Desktop"

REM Create the .url file on the desktop
(
echo [InternetShortcut]
echo URL=%URL%
) > "%DesktopPath%\%ShortcutName%.url"

echo Shortcut created on the desktop.
endlocal
pause

start "" "http://127.0.0.1:8001"