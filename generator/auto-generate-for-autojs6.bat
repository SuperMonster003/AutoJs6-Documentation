@ECHO OFF
SETLOCAL

python "%~dp0auto-generate.py" --sync-offline --increment-versions %*
EXIT /B %ERRORLEVEL%
