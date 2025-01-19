import fs from 'fs-extra';
import { join } from 'path';
import tar from 'tar';

async function createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = join(process.cwd(), 'backups');
    const backupPath = join(backupDir, `backup-${timestamp}.tgz`);

    try {
        await fs.ensureDir(backupDir);

        // Create tar archive
        await tar.create(
            {
                gzip: true,
                file: backupPath,
                cwd: process.cwd(),
            },
            [
                'src',
                'apps',
                'packages',
                'prisma',
                'package.json',
                'yarn.lock',
                '.env',
                'tsconfig.json'
            ]
        );

        console.log(`✅ Backup created at: ${backupPath}`);
        return backupPath;
    } catch (error) {
        console.error('❌ Backup failed:', error);
        throw error;
    }
}

export default createBackup; 