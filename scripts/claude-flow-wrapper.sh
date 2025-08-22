#!/bin/bash
# Claude Flow Wrapper for Unix/Linux/WSL - Fixes spawn issues
# This wrapper ensures proper environment setup for Claude Flow

export CLAUDE_CLI_PATH="/c/Users/encou/AppData/Roaming/npm/claude"
export CLAUDE_FLOW_MODE="non-interactive"
export NODE_ENV="development"
export PATH="/c/Users/encou/AppData/Roaming/npm:$PATH"

# Debug output (optional - remove in production)
echo "Using Claude CLI Path: $CLAUDE_CLI_PATH"
echo "Current PATH includes npm: $PATH"

# Execute claude-flow with all passed arguments
exec claude-flow "$@"