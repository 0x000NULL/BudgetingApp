import { config } from 'dotenv';
import { readFile } from 'fs/promises';
import { join } from 'path';

async function verifyEnv() {
    // Load environment variables first
    config();

    try {
        // Check root .env.example
        await verifyEnvFile('.env.example');

        // Check workspace .env files
        const workspaces = ['apps/backend', 'apps/web', 'apps/desktop'];
        for (const workspace of workspaces) {
            const envPath = join(process.cwd(), workspace, '.env.example');
            try {
                await verifyEnvFile(envPath);
            } catch (error: any) {
                if (error.code !== 'ENOENT') throw error;
                // Skip if .env.example doesn't exist for workspace
            }
        }

        console.log('✅ All required environment variables are set');
    } catch (error) {
        console.error('Error verifying environment variables:', error);
        process.exit(1);
    }
}

async function verifyEnvFile(path: string) {
    const envExample = await readFile(path, 'utf-8');
    const requiredVars = envExample
        .split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => line.split('=')[0]);

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error(`❌ Missing required environment variables in ${path}:`);
        missingVars.forEach(varName => console.error(`   - ${varName}`));
        process.exit(1);
    }
}

verifyEnv(); 