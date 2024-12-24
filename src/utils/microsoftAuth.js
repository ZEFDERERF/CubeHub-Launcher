import { WebviewWindow, getAll } from '@tauri-apps/api/window';
import { fetch } from '@tauri-apps/api/http';
import { emit, listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api';

class MicrosoftAuth {
	constructor() {
		this.clientId = '45c59e4a-0b56-4a7e-a01e-a1c17c792118';
		this.redirectUri = 'http://localhost:8080/oauth/redirect';
		this.authWindow = null;
		this.authCode = null;
	}

	async checkTauriEnvironment() {
		try {
			await invoke('tauri');
			return true;
		} catch (e) {
			console.error('Tauri 环境检测失败:', e);
			return false;
		}
	}

	async login() {
		try {
			// 检查是否在 Tauri 环境中
			const isTauri = await this.checkTauriEnvironment();
			if (!isTauri) {
				throw new Error('必须在 Tauri 环境中运行');
			}

			console.log('Starting Microsoft login...');

			// 创建 OAuth URL
			const authUrl = new URL('https://login.live.com/oauth20_authorize.srf');
			authUrl.searchParams.append('client_id', this.clientId);
			authUrl.searchParams.append('response_type', 'code');
			authUrl.searchParams.append('redirect_uri', this.redirectUri);
			authUrl.searchParams.append('scope', 'XboxLive.signin offline_access');

			// 创建登录窗口
			try {
				// 确保之前的窗口已关闭
				const existingWindows = await getAll();
				const existingAuthWindow = existingWindows.find(
					(w) => w.label === 'microsoft-login'
				);
				if (existingAuthWindow) {
					try {
						await existingAuthWindow.close();
					} catch (e) {
						console.warn('关闭旧窗口失败:', e);
					}
				}

				// 等待主窗口准备就绪
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// 创建新的认证窗口
				this.authWindow = await WebviewWindow.create('microsoft-login', {
					url: authUrl.toString(),
					title: 'Microsoft 登录',
					width: 800,
					height: 600,
					resizable: false,
					center: true,
					decorations: true,
					focus: true,
				});

				console.log('登录窗口已创建');

				// 设置事件监听
				const authCodePromise = new Promise((resolve, reject) => {
					const cleanup = async () => {
						if (this.authWindow) {
							try {
								await this.authWindow.close();
							} catch (e) {
								console.warn('关闭窗口失败:', e);
							}
							this.authWindow = null;
						}
					};

					// 监听认证响应
					const unlistenAuth = listen('microsoft-auth-response', async (event) => {
						console.log('收到认证响应:', event);
						await cleanup();
						if (event.payload.code) {
							resolve(event.payload.code);
						} else {
							reject(new Error(event.payload.error || '登录失败'));
						}
					});

					// 监听窗口关闭
					if (this.authWindow) {
						this.authWindow.listen('tauri://close', async () => {
							await cleanup();
							unlistenAuth();
							reject(new Error('用户取消登录'));
						});
					}

					// 设置超时
					setTimeout(async () => {
						await cleanup();
						unlistenAuth();
						reject(new Error('登录超时'));
					}, 300000); // 5分钟超时
				});

				// 等待认证码
				this.authCode = await authCodePromise;
			} catch (e) {
				console.error('创建登录窗口失败:', e);
				throw e;
			}

			// 获取访问令牌
			const tokenResponse = await fetch('https://login.live.com/oauth20_token.srf', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					client_id: this.clientId,
					code: this.authCode,
					grant_type: 'authorization_code',
					redirect_uri: this.redirectUri,
				}).toString(),
			});

			const msToken = await tokenResponse.json();

			// 获取 Xbox Live 令牌
			const xblResponse = await fetch('https://user.auth.xboxlive.com/user/authenticate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					Properties: {
						AuthMethod: 'RPS',
						SiteName: 'user.auth.xboxlive.com',
						RpsTicket: `d=${msToken.access_token}`,
					},
					RelyingParty: 'http://auth.xboxlive.com',
					TokenType: 'JWT',
				}),
			});

			const xblToken = await xblResponse.json();

			// 获取 Minecraft 令牌
			const mcResponse = await fetch(
				'https://api.minecraftservices.com/authentication/login_with_xbox',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						identityToken: `XBL3.0 x=${xblToken.DisplayClaims.xui[0].uhs};${xblToken.Token}`,
					}),
				}
			);

			const mcToken = await mcResponse.json();

			// 获取用户信息
			const profileResponse = await fetch(
				'https://api.minecraftservices.com/minecraft/profile',
				{
					headers: {
						Authorization: `Bearer ${mcToken.access_token}`,
					},
				}
			);

			const profile = await profileResponse.json();

			return {
				accessToken: mcToken.access_token,
				username: profile.name,
				uuid: profile.id,
			};
		} catch (error) {
			console.error('Microsoft 登录失败:', error);
			this.authWindow?.close();
			throw error;
		}
	}

	// 刷新令牌
	async refresh(accessToken) {
		try {
			const result = await this.authenticator.refresh(accessToken);
			const profile = await this.authenticator.getMinecraftProfile(result.accessToken);

			return {
				accessToken: result.accessToken,
				username: profile.name,
				uuid: profile.id,
			};
		} catch (error) {
			console.error('刷新令牌失败:', error);
			throw error;
		}
	}

	// 检查令牌是否有效
	async validate(accessToken) {
		try {
			await this.authenticator.validate(accessToken);
			return true;
		} catch {
			return false;
		}
	}
}

export const microsoftAuth = new MicrosoftAuth();
