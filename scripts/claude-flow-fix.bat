@echo off
REM Claude Flow Spawn Fix - Windows Batch Wrapper
REM This creates a 'claude' command that Claude Flow can find

set SCRIPT_DIR=%~dp0
set CLAUDE_WRAPPER=%SCRIPT_DIR%claude-flow-spawn-fix.js

REM Set environment variables
set CLAUDE_CLI_PATH=C:\Users\encou\AppData\Roaming\npm\claude.cmd
set NODE_PATH=C:\Users\encou\AppData\Roaming\npm\node_modules
set PATH=C:\Users\encou\AppData\Roaming\npm;%PATH%

REM Execute the Node.js wrapper
node "%CLAUDE_WRAPPER%" %*