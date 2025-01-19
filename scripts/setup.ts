import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, access } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

async function setup() {
    try {
        console.log('🚀 Setting up project...');

        // Setup workspaces
        const workspaces = [
            { path: 'apps/backend', env: 'DATABASE_URL=postgresql://localhost:5432/budget\nJWT_SECRET=development' },
            { path: 'apps/web', env: 'VITE_API_URL=http://localhost:3000' },
            { path: 'apps/desktop', env: 'ELECTRON_STORE_SECRET=development' },
            { path: 'apps/mobile', env: 'EXPO_PUBLIC_API_URL=http://localhost:3000' }
        ];

        for (const workspace of workspaces) {
            // Create workspace .env if it doesn't exist
            try {
                const envPath = join(process.cwd(), workspace.path, '.env');
                await writeFile(envPath, workspace.env, { flag: 'wx' });
                console.log(`📄 Created .env for ${workspace.path}`);
            } catch (error: any) {
                if (error.code !== 'EEXIST') throw error;
            }
        }

        // Initialize Prisma if available
        try {
            await access(join(process.cwd(), 'node_modules/.bin/prisma'));
            console.log('🗃️ Initializing database...');
            await execAsync('npx prisma generate');
        } catch (error) {
            console.log('Skipping Prisma initialization...');
        }

        console.log('✅ Setup complete!');
        console.log('\nTo complete setup for mobile and desktop apps, run:');
        console.log('1. For mobile: cd apps/mobile && npm install');
        console.log('2. For desktop: cd apps/desktop && npm install');
    } catch (error) {
        console.error('Error during setup:', error);
        process.exit(1);
    }
}

setup(); 