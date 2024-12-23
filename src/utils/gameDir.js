import { join } from '@tauri-apps/api/path';
import { createDir, exists } from '@tauri-apps/api/fs';

export async function getDefaultGameDir() {
	try {
		// 获取 AppData 路径
		const appData =
			process.env.APPDATA ||
			(process.platform === 'darwin'
				? join(process.env.HOME, 'Library/Application Support')
				: join(process.env.HOME, '.local/share'));

		// 构建 .minecraft 路径
		const minecraftDir = join(appData, '.minecraft');

		// 检查目录是否存在
		const dirExists = await exists(minecraftDir);

		// 如果目录不存在，创建它
		if (!dirExists) {
			await createDir(minecraftDir, { recursive: true });
		}

		return minecraftDir;
	} catch (error) {
		console.error('Failed to get/create game directory:', error);
		// 如果出错，返回默认路径
		return join(process.env.APPDATA || '', '.minecraft');
	}
}
