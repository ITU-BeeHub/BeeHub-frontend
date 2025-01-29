import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import axios from 'axios';
import { exec } from 'child_process';
import sudo from 'sudo-prompt';

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

    async installUpdate(installerPath: string): Promise<void> {
        try {
            await this.elevateAndInstall(installerPath);
            // Kurulum başladıktan sonra uygulamayı kapat
            setTimeout(() => app.quit(), 1000);
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
