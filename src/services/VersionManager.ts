import { fs, path } from '@tauri-apps/api';

export class VersionManager {
	async checkInstalledVersions() {
		const mcDir = await path.join(await path.appDir(), '.minecraft');
		const versionsDir = await path.join(mcDir, 'versions');

		try {
			const versions = await fs.readDir(versionsDir);
			return versions.filter((v) => fs.exists(path.join(v.path, `${v.name}.jar`)));
		} catch {
			return [];
		}
	}

	async isVersionInstalled(version: string) {
		const versions = await this.checkInstalledVersions();
		return versions.some((v) => v.name === version);
	}
}
