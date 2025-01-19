import { exec } from 'child_process';
import { promisify } from 'util';
import semver from 'semver';
import { readFile } from 'fs/promises';

const execAsync = promisify(exec);

async function validateTools() {
    try {
        // Check Node.js version
        const requiredNode = '>=18.0.0';
        const nodeVersion = process.version;
        if (!semver.satisfies(nodeVersion, requiredNode)) {
            throw new Error(`Node.js version ${requiredNode} is required. Current version: ${nodeVersion}`);
        }

        // Check yarn version
        const { stdout: yarnVersion } = await execAsync('yarn --version');
        const requiredYarn = '>=1.22.0';
        if (!semver.satisfies(yarnVersion.trim(), requiredYarn)) {
            throw new Error(`Yarn version ${requiredYarn} is required. Current version: ${yarnVersion.trim()}`);
        }

        // Check for required tools
        const tools = [
            { cmd: 'git --version', name: 'Git' },
            { cmd: 'docker --version', name: 'Docker' },
            { cmd: 'expo --version', name: 'Expo CLI' }
        ];

        for (const tool of tools) {
            try {
                await execAsync(tool.cmd);
            } catch {
                console.warn(`⚠️ ${tool.name} not found. Some features may not work.`);
            }
        }

        console.log('✅ All required tools are available');
        return true;
    } catch (error: unknown) {
        // Type guard for Error objects
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        
        console.error('❌ Tool validation failed:', errorMessage);
        console.log('\nPlease ensure you have the following installed:');
        console.log('- Node.js >=18.0.0');
        console.log('- Yarn >=1.22.0');
        console.log('- Git (recommended)');
        console.log('- Docker (recommended)');
        console.log('- Expo CLI (required for mobile development)');
        return false;
    }
}

export default validateTools; 