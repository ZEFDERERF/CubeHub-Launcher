import { ref } from 'vue'
import type { Account } from '../types'
import { getRandomSkin } from '../utils/skinUtils'

class AccountService {
	private currentAccount = ref<Account | null>(null);
	private accounts = ref<Account[]>([]);
	private readonly MICROSOFT_CLIENT_ID = '00000000402b5328';
	private readonly REDIRECT_URI = 'https://login.live.com/oauth20_desktop.srf';

	constructor() {
		this.loadAccounts();
	}

	private loadAccounts() {
		const savedAccounts = localStorage.getItem('accounts');
		if (savedAccounts) {
			this.accounts.value = JSON.parse(savedAccounts);
			const currentAccountId = localStorage.getItem('currentAccountId');
			if (currentAccountId) {
				this.currentAccount.value =
					this.accounts.value.find((a) => a.id === currentAccountId) || null;
			}
		}
	}

	private saveAccounts() {
		localStorage.setItem('accounts', JSON.stringify(this.accounts.value));
		if (this.currentAccount.value) {
			localStorage.setItem('currentAccountId', this.currentAccount.value.id);
		} else {
			localStorage.removeItem('currentAccountId');
		}
	}

	async initiateMicrosoftLogin(): Promise<void> {
		try {
			// 构建 Microsoft OAuth URL
			const oauthUrl = new URL('https://login.live.com/oauth20_authorize.srf');
			oauthUrl.searchParams.append('client_id', this.MICROSOFT_CLIENT_ID);
			oauthUrl.searchParams.append('response_type', 'code');
			oauthUrl.searchParams.append('redirect_uri', this.REDIRECT_URI);
			oauthUrl.searchParams.append('scope', 'XboxLive.signin offline_access');
			oauthUrl.searchParams.append('cobrandid', '8058f65d-ce06-4c30-9559-473c9275a65d');
			oauthUrl.searchParams.append('prompt', 'login');
			oauthUrl.searchParams.append('display', 'page');
			oauthUrl.searchParams.append('locale', 'zh-CN');

			// 打开登录窗口
			const authWindow = window.open(
				oauthUrl.toString(),
				'Microsoft Login',
				'width=800,height=600,menubar=0,toolbar=0,location=1,status=1,scrollbars=1,resizable=1'
			);

			if (!authWindow) {
				throw new Error('无法打开登录窗口');
			}

			// 监听重定向
			const code = await new Promise<string>((resolve, reject) => {
				const checkRedirect = setInterval(() => {
					try {
						if (authWindow.closed) {
							clearInterval(checkRedirect);
							reject(new Error('登录窗口被关闭'));
							return;
						}

						const currentUrl = authWindow.location.href;
						if (currentUrl.includes('code=')) {
							clearInterval(checkRedirect);
							const urlObj = new URL(currentUrl);
							const code = urlObj.searchParams.get('code');
							if (code) {
								resolve(code);
								authWindow.close();
							} else {
								reject(new Error('未获取到授权码'));
							}
						} else if (currentUrl.includes('error=')) {
							clearInterval(checkRedirect);
							authWindow.close();
							reject(new Error('登录失败'));
						}
					} catch (e) {
						// 忽略跨域错误
					}
				}, 100);

				// 30秒超时
				setTimeout(() => {
					clearInterval(checkRedirect);
					authWindow.close();
					reject(new Error('登录超时'));
				}, 30000);
			});

			console.log('获取到授权码:', code);

			// 使用获取到的 code 进行登录
			const result = await this.completeMicrosoftLogin(code);
			console.log('登录完成，结果:', result);

			// 更新当前账号
			const newAccount: Account = {
				id: result.id,
				type: 'microsoft',
				username: result.username,
				avatar: result.avatar,
				accessToken: result.accessToken,
				refreshToken: result.refreshToken,
				expiresAt: result.expiresAt,
				createdAt: new Date().toISOString(),
			};

			// 添加到账号列表
			this.accounts.value.push(newAccount);
			this.currentAccount.value = newAccount;
			this.saveAccounts();

			console.log('账号已保存');
		} catch (error: unknown) {
			console.error('Microsoft 登录失败:', error);
			throw error;
		}
	}

	private async initiateFullLogin(): Promise<void> {
		// 构建完整登录的 URL
		const oauthUrl = new URL('https://login.live.com/oauth20_authorize.srf');
		oauthUrl.searchParams.append('client_id', this.MICROSOFT_CLIENT_ID);
		oauthUrl.searchParams.append('response_type', 'code');
		oauthUrl.searchParams.append('redirect_uri', this.REDIRECT_URI);
		oauthUrl.searchParams.append('scope', 'XboxLive.signin offline_access');
		oauthUrl.searchParams.append('cobrandid', '8058f65d-ce06-4c30-9559-473c9275a65d');
		oauthUrl.searchParams.append('prompt', 'select_account');

		const authWindow = window.open(
			oauthUrl.toString(),
			'Microsoft Login',
			'width=800,height=600,menubar=0,toolbar=0,location=1,status=1,scrollbars=1,resizable=1'
		);

		if (!authWindow) {
			throw new Error('无法打开登录窗口');
		}

		const code = await new Promise<string>((resolve, reject) => {
			const checkRedirect = setInterval(() => {
				try {
					if (authWindow.closed) {
						clearInterval(checkRedirect);
						reject(new Error('登录窗口被关闭'));
						return;
					}

					const currentUrl = authWindow.location.href;
					if (currentUrl.includes('code=')) {
						clearInterval(checkRedirect);
						const urlObj = new URL(currentUrl);
						const code = urlObj.searchParams.get('code');
						if (code) {
							resolve(code);
							authWindow.close();
						} else {
							reject(new Error('未获取到授权码'));
						}
					}
				} catch (e) {
					// 忽略跨域错误
				}
			}, 100);

			// 30秒超时
			setTimeout(() => {
				clearInterval(checkRedirect);
				authWindow.close();
				reject(new Error('登录超时'));
			}, 30000);
		});

		await this.completeMicrosoftLogin(code);
	}

	async completeMicrosoftLogin(code: string): Promise<MicrosoftAuthResult> {
		try {
			console.log('开始处理登录...');

			// 使用授权码获取访问令牌
			const tokenResponse = await fetch('https://login.live.com/oauth20_token.srf', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					client_id: this.MICROSOFT_CLIENT_ID,
					code: code,
					grant_type: 'authorization_code',
					redirect_uri: this.REDIRECT_URI,
				}),
			});

			if (!tokenResponse.ok) {
				const error = await tokenResponse.text();
				console.error('Token response error:', error);
				throw new Error('获取访问令牌失败');
			}

			const tokenData = await tokenResponse.json();
			console.log('获取到访问令牌');

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
						RpsTicket: `d=${tokenData.access_token}`,
					},
					RelyingParty: 'http://auth.xboxlive.com',
					TokenType: 'JWT',
				}),
			});

			if (!xblResponse.ok) {
				const error = await xblResponse.text();
				console.error('XBL response error:', error);
				throw new Error('Xbox Live 认证失败');
			}

			const xblData = await xblResponse.json();
			console.log('获取到 Xbox Live 令牌');

			// 获取 XSTS 令牌
			const xstsResponse = await fetch('https://xsts.auth.xboxlive.com/xsts/authorize', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					Properties: {
						SandboxId: 'RETAIL',
						UserTokens: [xblData.Token],
					},
					RelyingParty: 'rp://api.minecraftservices.com/',
					TokenType: 'JWT',
				}),
			});

			if (!xstsResponse.ok) {
				const error = await xstsResponse.text();
				console.error('XSTS response error:', error);
				throw new Error('XSTS 认证失败');
			}

			const xstsData = await xstsResponse.json();
			console.log('获取到 XSTS 令牌');

			// 获取 Minecraft 访问令牌
			const mcResponse = await fetch(
				'https://api.minecraftservices.com/authentication/login_with_xbox',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						identityToken: `XBL3.0 x=${xblData.DisplayClaims.xui[0].uhs};${xstsData.Token}`,
					}),
				}
			);

			if (!mcResponse.ok) {
				const error = await mcResponse.text();
				console.error('MC response error:', error);
				throw new Error('Minecraft 认证失败');
			}

			const mcData = await mcResponse.json();
			console.log('获取到 Minecraft 访问令牌');

			// 获取用户信息
			const profileResponse = await fetch(
				'https://api.minecraftservices.com/minecraft/profile',
				{
					headers: {
						Authorization: `Bearer ${mcData.access_token}`,
					},
				}
			);

			if (!profileResponse.ok) {
				const error = await profileResponse.text();
				console.error('Profile response error:', error);
				throw new Error('获取用户信息失败');
			}

			const profileData = await profileResponse.json();
			console.log('获取到用户信息');

			// 返回登录结果
			return {
				id: profileData.id,
				username: profileData.name,
				avatar: `https://crafatar.com/avatars/${profileData.id}?overlay=true`,
				accessToken: mcData.access_token,
				refreshToken: tokenData.refresh_token,
				expiresAt: new Date(Date.now() + mcData.expires_in * 1000).toISOString(),
			};
		} catch (error) {
			console.error('完成登录过程时出错:', error);
			throw error;
		}
	}

	private async extractSkinHead(skinUrl: string): Promise<string> {
		const skinImage = new Image();
		skinImage.crossOrigin = 'anonymous';
		skinImage.src = skinUrl;

		await new Promise((resolve, reject) => {
			skinImage.onload = resolve;
			skinImage.onerror = reject;
		});

		const canvas = document.createElement('canvas');
		canvas.width = 8;
		canvas.height = 8;
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			throw new Error('无法创建 Canvas 上下文');
		}

		ctx.drawImage(skinImage, 8, 8, 8, 8, 0, 0, 8, 8);
		return canvas.toDataURL('image/png');
	}

	async loginOffline(username: string): Promise<void> {
		try {
			const { skinPath, headImage } = await getRandomSkin();

			const account: Account = {
				id: crypto.randomUUID(),
				type: 'offline',
				username,
				avatar: headImage,
				skinPath,
				createdAt: new Date().toISOString(),
			};

			this.accounts.value.push(account);
			this.currentAccount.value = account;
			this.saveAccounts();
		} catch (error) {
			console.error('离线登录失败:', error);
			throw error;
		}
	}

	setCurrentAccount(account: Account) {
		this.currentAccount.value = account;
		this.saveAccounts();
	}

	async removeAccount(account: Account) {
		const index = this.accounts.value.findIndex((a) => a.id === account.id);
		if (index !== -1) {
			this.accounts.value.splice(index, 1);
			if (this.currentAccount.value?.id === account.id) {
				this.currentAccount.value = this.accounts.value[0] || null;
			}
			this.saveAccounts();
		}
	}

	getCurrentAccount() {
		return this.currentAccount;
	}

	getAccounts() {
		return this.accounts;
	}
}

export const accountService = new AccountService();
