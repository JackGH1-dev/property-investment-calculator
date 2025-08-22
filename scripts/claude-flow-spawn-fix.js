#!/usr/bin/env node
/**
 * Claude Flow Spawn Fix - Wrapper to resolve ENOENT issues
 * This script acts as a bridge between Claude Flow and Claude CLI
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to find Claude CLI executable
function findClaudeCLI() {
    const possiblePaths = [
        // Environment variable
        process.env.CLAUDE_CLI_PATH,
        
        // Windows paths
        'C:\\Users\\encou\\AppData\\Roaming\\npm\\claude.cmd',
        'C:\\Users\\encou\\AppData\\Roaming\\npm\\claude.exe',
        
        // Unix paths
        '/c/Users/encou/AppData/Roaming/npm/claude',
        
        // Direct Node.js invocation
        process.platform === 'win32' 
            ? 'C:\\Users\\encou\\AppData\\Roaming\\npm\\node_modules\\@anthropic-ai\\claude-code\\cli.js'
            : '/c/Users/encou/AppData/Roaming/npm/node_modules/@anthropic-ai/claude-code/cli.js',
        
        // Fallback to system PATH
        'claude'
    ];
    
    for (const claudePath of possiblePaths) {
        if (!claudePath) continue;
        
        try {
            // For .js files, we need to use node
            if (claudePath.endsWith('.js')) {
                execSync(`node "${claudePath}" --version`, { stdio: 'ignore' });
                return { path: 'node', args: [claudePath] };
            }
            
            // For executables, test directly
            if (fs.existsSync(claudePath)) {
                execSync(`"${claudePath}" --version`, { stdio: 'ignore' });
                return { path: claudePath, args: [] };
            }
            
            // Try with system PATH
            if (claudePath === 'claude') {
                execSync('claude --version', { stdio: 'ignore' });
                return { path: 'claude', args: [] };
            }
        } catch (error) {
            // Continue to next option
            continue;
        }
    }
    
    throw new Error('Claude CLI not found. Please ensure Claude Code is installed.');
}

// Main wrapper function
function spawnClaudeWrapper() {
    try {
        const claude = findClaudeCLI();
        const args = process.argv.slice(2); // Get arguments passed to this script
        
        console.log(`🔧 Spawning Claude CLI: ${claude.path} ${claude.args.concat(args).join(' ')}`);
        
        const child = spawn(claude.path, claude.args.concat(args), {
            stdio: 'inherit',
            shell: process.platform === 'win32'
        });
        
        child.on('exit', (code) => {
            process.exit(code);
        });
        
        child.on('error', (error) => {
            console.error('❌ Claude CLI spawn error:', error.message);
            process.exit(1);
        });
        
    } catch (error) {
        console.error('❌ Claude CLI wrapper error:', error.message);
        process.exit(1);
    }
}

// Execute if run directly
if (require.main === module) {
    spawnClaudeWrapper();
}

module.exports = { findClaudeCLI, spawnClaudeWrapper };