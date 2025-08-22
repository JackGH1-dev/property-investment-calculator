@echo off
REM Claude Flow Wrapper for Windows - Fixes spawn issues
REM This wrapper ensures proper environment setup for Claude Flow

set CLAUDE_CLI_PATH=C:\Users\encou\AppData\Roaming\npm\claude.cmd
set CLAUDE_FLOW_MODE=non-interactive
set NODE_ENV=development
set PATH=C:\Users\encou\AppData\Roaming\npm;%PATH%

REM Debug output (optional - remove in production)
echo Using Claude CLI Path: %CLAUDE_CLI_PATH%
echo Current PATH includes npm: %PATH%

REM Execute claude-flow with all passed arguments
claude-flow %*