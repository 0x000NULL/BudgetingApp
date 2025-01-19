import { rm, access } from 'fs/promises';
import { join } from 'path';
import createBackup from './backup';

interface CleanOptions {
    dryRun?: boolean;
    backup?: boolean;
}

async function cleanProject(options: CleanOptions = {}) {
    const directories = [
        'node_modules',
        'dist',
        'build',
        '.turbo',
        'coverage',
        '.next',
        'apps/*/node_modules',
        'apps/*/.next',
        'apps/*/dist',
        'packages/*/node_modules',
        'packages/*/dist',
        'apps/desktop/dist',
        'apps/desktop/build',
        '.electron-builder',
        'apps/mobile/.expo',
        'apps/mobile/android/build',
        'apps/mobile/ios/build',
    ];

    try {
        if (options.backup) {
            console.log('📦 Creating backup...');
            await createBackup();
        }

        if (options.dryRun) {
            console.log('🔍 Dry run - would clean these directories:');
            directories.forEach(dir => console.log(`  - ${dir}`));
            return;
        }

        console.log('🧹 Cleaning directories...');
        const progress = new ProgressBar('[:bar] :current/:total :percent', {
            total: directories.length,
            width: 40
        });

        for (const dir of directories) {
            try {
                await rm(join(process.cwd(), dir), { recursive: true, force: true });
                progress.tick();
            } catch (error) {
                if (error.code !== 'ENOENT') throw error;
                progress.tick();
            }
        }

        console.log('✨ Cleaned all build and dependency folders');
    } catch (error) {
        console.error('❌ Error cleaning directories:', error);
        console.log('\nRecovery suggestions:');
        console.log('1. Try running with --dry-run first');
        console.log('2. Check file permissions');
        console.log('3. Close any applications using these directories');
        console.log('4. Run with --backup flag to create a backup first');
        process.exit(1);
    }
}

if (require.main === module) {
    const args = process.argv.slice(2);
    cleanProject({
        dryRun: args.includes('--dry-run'),
        backup: args.includes('--backup')
    });
}

export default cleanProject; 