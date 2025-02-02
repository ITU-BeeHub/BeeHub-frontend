import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { exec } from 'child_process';
import sudo from 'sudo-prompt';
import { promisify } from 'util';

const execPromise = promisify(exec);

export class AutoUpdater {
    private tempDir: string;
    private installerPath: string | null = null;

    constructor() {
        this.tempDir = path.join(app.getPath('temp'), 'beehub-updates');
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    async downloadUpdate(): Promise<string> {
        const platform = process.platform;
        const downloadUrl = `https://beehubapp.com/api/download?os=${platform === 'darwin' ? 'mac' : 'windows'}`;

        const response = await axios({
            url: downloadUrl,
            method: 'GET',
            responseType: 'arraybuffer', // Değişiklik: stream yerine arraybuffer kullan
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });

        const fileName = platform === 'darwin' ? 'installer.dmg' : 'installer.exe';
        const filePath = path.join(this.tempDir, fileName);

        // Dosyayı sync olarak yaz
        fs.writeFileSync(filePath, response.data);

        // Dosya izinlerini ayarla
        fs.chmodSync(filePath, 0o755);

        this.installerPath = filePath;
        return filePath;
    }

    private async elevateAndInstall(installerPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const options = {
                name: 'BeeHub Installer'
            };

            if (process.platform === 'win32') {
                // Windows için PowerShell ile yükseltilmiş izinlerle çalıştır
                const command = `Start-Process "${installerPath}" -ArgumentList '/SILENT,/NORESTART' -Verb RunAs`;
                sudo.exec(`powershell -Command "${command}"`, options, (error) => {
                    if (error) reject(error);
                    else resolve();
                });
            } else {
                // Mac için
                sudo.exec(`open "${installerPath}"`, options, (error) => {
                    if (error) reject(error);
                    else resolve();
                });
            }
        });
    }

    private async mountDmg(dmgPath: string): Promise<string> {
        const { stdout } = await execPromise(`hdiutil attach "${dmgPath}" -nobrowse`);
        const mountPath = stdout.split('\n')
            .filter(line => line.includes('/Volumes/'))
            .pop()
            ?.split('/Volumes/')[1]
            .trim();
        
        if (!mountPath) throw new Error('Failed to mount DMG');
        return `/Volumes/${mountPath}`;
    }

    private async unmountDmg(volumePath: string): Promise<void> {
        await execPromise(`hdiutil detach "${volumePath}" -force`);
    }

    private async updateMacApp(volumePath: string): Promise<void> {
        const appName = 'BeeHub.app';
        const sourceApp = path.join(volumePath, appName);
        const currentApp = app.getPath('exe').replace(/\/Contents\/MacOS\/.*$/, '');
        
        if (!fs.existsSync(sourceApp)) {
            throw new Error('Update package is invalid');
        }

        const updateScript = `
            rm -rf "${currentApp}" && 
            cp -R "${sourceApp}" "${path.dirname(currentApp)}/" && 
            touch "${currentApp}"
        `;

        return new Promise((resolve, reject) => {
            sudo.exec(updateScript, { name: 'BeeHub Updater' }, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }

    async installUpdate(installerPath: string): Promise<void> {
        try {
            if (process.platform === 'darwin') {
                const volumePath = await this.mountDmg(installerPath);
                await this.updateMacApp(volumePath);
                await this.unmountDmg(volumePath);
                setTimeout(() => app.relaunch(), 1000);
                setTimeout(() => app.quit(), 2000);
            } else {
                // Windows logic remains the same
                await this.elevateAndInstall(installerPath);
                setTimeout(() => app.quit(), 1000);
            }
        } catch (error) {
            console.error('Installation error:', error);
            throw error;
        }
    }

    quitAndInstall(_isSilent = false, _isForceRunAfter = true): void {
        if (!this.installerPath) {
            throw new Error('No installer available. Please download update first.');
        }

        this.elevateAndInstall(this.installerPath)
            .then(() => app.quit())
            .catch(console.error);
    }

    cleanupTempFiles(): void {
        try {
            fs.rmSync(this.tempDir, { recursive: true, force: true });
        } catch (error) {
            console.error('Error cleaning up temp files:', error);
        }
    }
}
