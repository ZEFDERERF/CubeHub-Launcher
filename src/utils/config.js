import { appConfigDir, join } from '@tauri-apps/api/path';
import { exists, createDir, writeTextFile, readTextFile } from '@tauri-apps/api/fs';
import { invoke } from '@tauri-apps/api/tauri';

class ConfigManager {
	constructor() {
		this.defaultConfig = {
			gameDir: '',
			lastUsername: '',
			accounts: [],
			isInitialized: false,
			javaPath: '',
			maxMemory: 2048,
		};
		this.config = { ...this.defaultConfig };
	}

	async getDefaultGameDir() {
		try {
			if (!window.__TAURI__) {
				return 'C:\\Users\\Username\\AppData\\Roaming\\.minecraft';
			}

			// 获取 Windows 用户名
			const username = await invoke('get_username');
			console.log('获取到用户名:', username);

			// 构建默认的 Minecraft 路径
			const defaultPath = `C:\\Users\\${username}\\AppData\\Roaming\\.minecraft`;
			console.log('默认游戏路径:', defaultPath);

			return defaultPath;
		} catch (error) {
			console.error('获取默认游戏目录失败:', error);
			return 'C:\\Users\\Username\\AppData\\Roaming\\.minecraft';
		}
	}

	async init() {
		try {
			if (!window.__TAURI__) {
				// 在非 Tauri 环境中使用 localStorage
				const stored = localStorage.getItem('cubehub-config');
				if (stored) {
					const parsedConfig = JSON.parse(stored);
					// 确保所有必要的字段都存在
					this.config = {
						...this.defaultConfig,
						...parsedConfig,
					};
				} else {
					this.config.gameDir = await this.getDefaultGameDir();
					localStorage.setItem('cubehub-config', JSON.stringify(this.config));
				}
				return;
			}

			// 获取配置文件路径
			const configDir = await appConfigDir();
			const configPath = await join(configDir, 'config.json');

			// 检查配置文件是否存在
			if (await exists(configPath)) {
				// 读取现有配置
				const configData = await readTextFile(configPath);
				const parsedConfig = JSON.parse(configData);
				// 确保所有必要的字段都存在
				this.config = {
					...this.defaultConfig,
					...parsedConfig,
				};
			} else {
				// 创建配置目录
				await createDir(configDir, { recursive: true });

				// 设置默认游戏目录
				this.config.gameDir = await this.getDefaultGameDir();

				// 保存默认配置
				await this.save();
			}

			console.log('配置初始化完成:', this.config);
		} catch (error) {
			console.error('配置初始化失败:', error);
			// 使用默认配置
			this.config = { ...this.defaultConfig };
			this.config.gameDir = await this.getDefaultGameDir();
		}
	}

	async save() {
		try {
			// 确保 accounts 是数组
			if (!Array.isArray(this.config.accounts)) {
				this.config.accounts = [];
			}

			if (!window.__TAURI__) {
				// 在非 Tauri 环境中使�� localStorage
				localStorage.setItem('cubehub-config', JSON.stringify(this.config));
				return;
			}

			const configDir = await appConfigDir();
			const configPath = await join(configDir, 'config.json');
			await writeTextFile(configPath, JSON.stringify(this.config, null, 2));
		} catch (error) {
			console.error('保存配置失败:', error);
			throw error;
		}
	}

	// 获取游戏目录
	getGameDir() {
		return this.config.gameDir || this.defaultConfig.gameDir;
	}

	// 设置游戏目录
	async setGameDir(dir) {
		this.config.gameDir = dir;
		await this.save();
	}

	// 获取上次使用的用户名
	getLastUsername() {
		return this.config.lastUsername || this.defaultConfig.lastUsername;
	}

	// 设置上次使用的用户名
	async setLastUsername(username) {
		this.config.lastUsername = username;
		await this.save();
	}

	// 获取所有账户
	getAccounts() {
		return Array.isArray(this.config.accounts) ? this.config.accounts : [];
	}

	// 添加账户
	async addAccount(account) {
		if (!Array.isArray(this.config.accounts)) {
			this.config.accounts = [];
		}

		const existingIndex = this.config.accounts.findIndex((a) => a.uuid === account.uuid);
		if (existingIndex !== -1) {
			this.config.accounts[existingIndex] = account;
		} else {
			this.config.accounts.push(account);
		}
		await this.save();
	}

	// 移除账户
	async removeAccount(uuid) {
		if (!Array.isArray(this.config.accounts)) {
			this.config.accounts = [];
			return;
		}
		this.config.accounts = this.config.accounts.filter((a) => a.uuid !== uuid);
		await this.save();
	}

	// 检查是否完成初始化
	isInitialized() {
		return Boolean(
			this.config.isInitialized &&
				this.config.gameDir &&
				this.config.accounts.length > 0 &&
				this.config.javaPath
		);
	}

	// 设置初始化状态
	async setInitialized(value = true) {
		this.config.isInitialized = value;
		await this.save();
	}

	// 获取 Java 路径
	getJavaPath() {
		return this.config.javaPath || this.defaultConfig.javaPath;
	}

	// 设置 Java 路径
	async setJavaPath(path) {
		this.config.javaPath = path;
		await this.save();
	}

	// 获取最大内存
	getMaxMemory() {
		return this.config.maxMemory || this.defaultConfig.maxMemory;
	}

	// 设置最大内存
	async setMaxMemory(memory) {
		this.config.maxMemory = memory;
		await this.save();
	}
}

export const configManager = new ConfigManager();
