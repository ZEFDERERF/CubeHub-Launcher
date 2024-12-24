<template>
	<div class="home-container">
		<!-- 左侧快速启动面板 -->
		<div class="quick-start-panel">
			<div class="panel-content">
				<div class="account-section">
					<!-- 账号信息/登录按钮 -->
					<div v-if="currentAccount" class="account-info">
						<div class="avatar-container">
							<img :src="currentAccount.avatar" class="avatar" />
						</div>
						<div class="account-details">
							<span class="username">{{ currentAccount.username }}</span>
							<span class="account-type">{{
								currentAccount.type === 'microsoft' ? '正版账号' : '离线账号'
							}}</span>
						</div>
						<button class="switch-account" @click="showAccountMenu = !showAccountMenu">
							<svg class="icon" viewBox="0 0 24 24" fill="none">
								<path
									d="M7 10l5 5 5-5"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>

						<!-- 账号切换菜单 -->
						<div v-if="showAccountMenu" class="account-menu">
							<div class="menu-header">
								<h3>切换账号</h3>
								<button class="add-account" @click="showLoginModal = true">
									<svg class="icon" viewBox="0 0 24 24" fill="none">
										<path
											d="M12 5v14m-7-7h14"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
										/>
									</svg>
									添加账号
								</button>
							</div>
							<div class="account-list">
								<div
									v-for="account in accounts"
									:key="account.id"
									class="account-item"
									:class="{ active: currentAccount.id === account.id }"
									@click="switchAccount(account)"
								>
									<img :src="account.avatar" class="avatar" />
									<div class="account-details">
										<span class="username">{{ account.username }}</span>
										<span class="account-type">{{
											account.type === 'microsoft' ? '正版账号' : '离线账号'
										}}</span>
									</div>
									<button
										class="remove-account"
										@click.stop="removeAccount(account)"
									>
										<svg class="icon" viewBox="0 0 24 24">
											<path
												fill="currentColor"
												d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>
					<button v-else class="login-button" @click="showLoginModal = true">
						<svg class="icon" width="20" height="20" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M3.996.695L5.094 2.9l2.204 1.097l-2.204 1.097l-1.098 2.204L2.9 5.093L.695 3.996L2.9 2.9zM12 3c-.622 0-1.23.063-1.815.183l-.98.2l-.4-1.96l.98-.2A11 11 0 0 1 12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12c0-.885.105-1.746.303-2.573l.233-.972l1.945.466l-.233.973A9 9 0 1 0 12 3m2.512 5.934h2.004v2.004h-2.003zm-7.049 0h2.004v2.004H7.463zm2.447 4.252l.488.872a1.834 1.834 0 0 0 3.206 0l.488-.872l1.745.977l-.488.872a3.834 3.834 0 0 1-6.696 0l-.488-.872zm10.92 7.633l-1.568.78l1.569.782l.78 1.569l.782-1.57l1.569-.78l-1.57-.781l-.78-1.569z"
							/>
						</svg>
						登录账号
					</button>
				</div>

				<!-- 启动游戏按钮 -->
				<button class="launch-button" :disabled="!currentAccount" @click="launchGame">
					<svg class="icon" width="24" height="24" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12S6.48 2 12 2m0 18c4.42 0 8-3.58 8-8s-3.58-8-8-8s-8 3.58-8 8s3.58 8 8 8m1-8v4h-2v-4H8l4-4l4 4z"
						/>
					</svg>
					启动游戏
				</button>
			</div>
		</div>

		<!-- 主内容区域 -->
		<div class="main-content">
			<!-- 欢迎栏 -->
			<div v-if="homeSettings.showWelcome.value" class="welcome-section">
				<h1>欢迎回来{{ currentAccount ? '，' + currentAccount.username : '' }}！</h1>
				<p>准备好开始新的冒险了吗？</p>
			</div>

			<!-- 最近游戏栏 -->
			<div v-if="homeSettings.showRecentGames.value" class="recent-games">
				<h2>最近游戏</h2>
				<div class="game-list">
					<div v-for="game in recentGames" :key="game.id" class="game-card">
						<img :src="game.icon" :alt="game.name" class="game-icon" />
						<div class="game-info">
							<h3>{{ game.name }}</h3>
							<p>{{ game.lastPlayed }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 最近游戏栏 -->
		<div v-if="showRecentGames" class="recent-games">
			<h2>最近游戏</h2>
			<div class="game-list">
				<div v-for="game in recentGames" :key="game.id" class="game-card">
					<img :src="game.icon" :alt="game.name" class="game-icon" />
					<div class="game-info">
						<h3>{{ game.name }}</h3>
						<p>{{ game.lastPlayed }}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- 登录相关的模态框 -->
	<Modal v-if="showLoginModal" @close="closeLoginModal">
		<LoginSelector v-if="!loginType" @select="handleLoginSelect" />
		<OfflineLoginForm
			v-else-if="loginType === 'offline'"
			@back="loginType = ''"
			@submit="handleOfflineLogin"
		/>
		<template v-else-if="loginType === 'microsoft'">
			<MicrosoftLoginForm
				:state="microsoftLoginState"
				@back="loginType = ''"
				@submit="handleMicrosoftCode"
			/>
		</template>
	</Modal>

	<Modal v-if="showOfflineLogin" @close="showOfflineLogin = false">
		<div class="offline-login-form">
			<h2>离线登录</h2>
			<form @submit.prevent="loginOffline">
				<div class="form-group">
					<label>用户名</label>
					<input v-model="offlineUsername" type="text" required />
				</div>
				<button type="submit">登录</button>
			</form>
		</div>
	</Modal>

	<!-- 添加到 template 中的 Modal 部分 -->
	<ConfirmDialog
		v-if="showDeleteConfirm"
		title="删除账号"
		:message="'确定要删除账号 ' + accountToDelete?.username + ' 吗？此操作无法撤销。'"
		confirmText="删除"
		:danger="true"
		:requireInput="true"
		@close="cancelDelete"
		@confirm="confirmDelete"
	/>
	</div>
</template>

<style scoped>
.home-container {
	height: 100%;
	display: flex;
	gap: 2rem;
	padding: 2rem;
	background: var(--background-color);
}

/* 左侧快速启动面板 */
.quick-start-panel {
	width: 300px;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.panel-content {
	background: var(--surface-color);
	padding: 1.5rem;
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

/* 主内容区域 */
.main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2rem;
	overflow-y: auto;
}

/* 欢迎栏样式 */
.welcome-section {
	background: var(--surface-color);
	padding: 2rem;
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.welcome-section h1 {
	font-size: 2rem;
	margin-bottom: 0.5rem;
}

/* 最近游戏栏样式 */
.recent-games {
	background: var(--surface-color);
	padding: 2rem;
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.game-list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 1rem;
	margin-top: 1rem;
}

.game-card {
	background: var(--background-color);
	padding: 1rem;
	border-radius: 8px;
	display: flex;
	align-items: center;
	gap: 1rem;
	transition: all 0.3s ease;
}

.game-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.game-icon {
	width: 48px;
	height: 48px;
	border-radius: 8px;
}

/* 账号部分样式 */
.account-section {
	position: relative;
}

.account-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	padding: 1rem;
	background: var(--background-color);
	border-radius: 12px;
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
}

.account-info:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-container {
	width: 64px;
	height: 64px;
	position: relative;
	border-radius: 8px;
	overflow: hidden;
	background: var(--background-color);
}

.avatar {
	width: 100%;
	height: 100%;
	object-fit: cover;
	image-rendering: pixelated;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.account-details {
	text-align: center;
	min-width: 0;
}

.username {
	font-size: 1.1rem;
	font-weight: 500;
	color: var(--text-color);
	margin: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.account-type {
	font-size: 0.85rem;
	color: var(--secondary-text);
	margin: 0;
}

.switch-account {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	width: 24px;
	height: 24px;
	padding: 0;
	border: none;
	background: transparent;
	color: var(--secondary-text);
	cursor: pointer;
	opacity: 0;
	transition: all 0.3s ease;
}

.account-info:hover .switch-account {
	opacity: 1;
}

.switch-account:hover {
	color: var(--text-color);
	transform: scale(1.1);
}

/* 账号菜单样式 */
.account-menu {
	position: absolute;
	top: calc(100% + 0.5rem);
	left: 0;
	right: 0;
	background: var(--surface-color);
	border-radius: 12px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	padding: 1rem;
	z-index: 100;
	animation: menuSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.menu-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1rem;
}

.menu-header h3 {
	margin: 0;
	font-size: 1.1rem;
	color: var(--text-color);
}

.add-account {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 0.75rem;
	border: none;
	border-radius: 6px;
	background: var(--theme-color);
	color: white;
	font-size: 0.9rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.add-account:hover {
	filter: brightness(1.1);
	transform: translateY(-1px);
}

.account-list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.account-item {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0.75rem;
	border-radius: 8px;
	background: var(--background-color);
	cursor: pointer;
	transition: all 0.3s ease;
}

.account-item:hover {
	transform: translateX(4px);
	background: rgba(var(--theme-color-rgb), 0.1);
}

.account-item.active {
	background: rgba(var(--theme-color-rgb), 0.15);
}

.account-item .avatar {
	width: 40px;
	height: 40px;
	object-fit: cover;
}

.account-item .account-details {
	flex: 1;
	text-align: left;
}

.remove-account {
	width: 24px;
	height: 24px;
	padding: 0;
	border: none;
	background: transparent;
	color: var(--secondary-text);
	cursor: pointer;
	opacity: 0;
	transition: all 0.3s ease;
}

.account-item:hover .remove-account {
	opacity: 1;
}

/* 临时对其 */
.login-button {
	display: flex;
	align-items: center;
}

.remove-account:hover {
	color: #ff4d4f;
	transform: scale(1.1);
}

/* 启动按钮样式 */
.launch-button {
	background: var(--theme-color);
	color: white;
	border: none;
	border-radius: 8px;
	padding: 1rem;
	font-size: 1.1rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
}

.launch-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.launch-button .icon {
	width: 24px;
	height: 24px;
	flex-shrink: 0;
}

/* 登录模态框样式 */
.login-modal {
	padding: 2rem;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.login-options {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.microsoft-login,
.offline-login {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 1rem;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	font-size: 1rem;
	transition: all 0.3s ease;
}

.microsoft-login {
	background: #00a4ef;
	color: white;
}

.offline-login {
	background: var(--surface-color);
	color: var(--text-color);
	border: 1px solid rgba(128, 128, 128, 0.2);
}

/* 通用图标样式 */
.icon {
	width: 24px;
	height: 24px;
}

/* 添加卡片动效 */
.welcome-section {
	animation: slideInFromTop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

.quick-start-panel {
	animation: slideInFromLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

.recent-games {
	animation: slideInFromRight 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
	animation-delay: 0.2s;
}

@keyframes slideInFromTop {
	0% {
		opacity: 0;
		transform: translateY(-50px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes slideInFromLeft {
	0% {
		opacity: 0;
		transform: translateX(-50px);
	}
	100% {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes slideInFromRight {
	0% {
		opacity: 0;
		transform: translateX(50px);
	}
	100% {
		opacity: 1;
		transform: translateX(0);
	}
}

.game-card {
	animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
	animation-delay: calc(var(--index) * 0.1s + 0.3s);
}

@keyframes scaleIn {
	0% {
		opacity: 0;
		transform: scale(0.8);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
}

/* 登录模态框动画 */
.login-modal {
	animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalIn {
	0% {
		opacity: 0;
		transform: scale(0.9);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
}

/* 登录选项按钮动 */
.microsoft-login,
.offline-login {
	position: relative;
	overflow: hidden;
	transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.microsoft-login::before,
.offline-login::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: 0;
	height: 0;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 50%;
	transform: translate(-50%, -50%);
	transition:
		width 0.6s ease,
		height 0.6s ease;
}

.microsoft-login:hover::before,
.offline-login:hover::before {
	width: 300px;
	height: 300px;
}

.microsoft-login:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 164, 239, 0.3);
}

.offline-login:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 离线登录表单动画 */
.offline-login-form {
	animation: formIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes formIn {
	0% {
		opacity: 0;
		transform: translateY(20px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

.form-group {
	animation: fadeInUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
	animation-delay: 0.1s;
}

@keyframes fadeInUp {
	0% {
		opacity: 0;
		transform: translateY(10px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 修改离线登录表单样式 */
.offline-login-form {
	background: var(--surface-color);
	border-radius: 12px;
	padding: 2rem;
	width: 100%;
	max-width: 400px;
}

.offline-login-form h2 {
	margin-bottom: 1.5rem;
	text-align: center;
	color: var(--text-color);
}

.form-group {
	margin-bottom: 1.5rem;
}

.form-group label {
	display: block;
	margin-bottom: 0.5rem;
	color: var(--text-color);
}

.form-group input {
	width: 100%;
	padding: 0.75rem 1rem;
	border: 1px solid rgba(var(--theme-color-rgb), 0.2);
	border-radius: 8px;
	background: var(--background-color);
	color: var(--text-color);
	transition: all 0.3s ease;
}

.form-group input:focus {
	border-color: var(--theme-color);
	box-shadow: 0 0 0 2px rgba(var(--theme-color-rgb), 0.1);
}

.offline-login-form button[type='submit'] {
	width: 100%;
	padding: 0.75rem;
	background: var(--theme-color);
	color: white;
	border: none;
	border-radius: 8px;
	font-size: 1rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.offline-login-form button[type='submit']:hover {
	filter: brightness(1.1);
	transform: translateY(-2px);
}

.offline-login-form button[type='submit']:active {
	transform: translateY(0);
}

/* 账号菜单动画 */
.account-menu {
	animation: menuSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	transform-origin: top center;
}

@keyframes menuSlideIn {
	0% {
		opacity: 0;
		transform: translateY(-10px) scale(0.95);
	}
	100% {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

.account-item {
	animation: itemFadeIn 0.3s ease backwards;
	animation-delay: calc(var(--index) * 0.05s);
}

@keyframes itemFadeIn {
	0% {
		opacity: 0;
		transform: translateX(-10px);
	}
	100% {
		opacity: 1;
		transform: translateX(0);
	}
}

/* Microsoft 登录加载动画 */
.microsoft-login-container {
	padding: 3rem;
	text-align: center;
	animation: containerIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes containerIn {
	0% {
		opacity: 0;
		transform: scale(0.9);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
}

.loading-animation {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
}

.spinner {
	width: 48px;
	height: 48px;
	border: 4px solid rgba(0, 164, 239, 0.1);
	border-left-color: #00a4ef;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.loading-animation p {
	color: var(--text-color);
	font-size: 1.1rem;
}

.version-buttons {
	display: flex;
	gap: 1rem;
	margin-top: 1rem;
}

.version-button {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1rem;
	border: none;
	border-radius: 8px;
	background: var(--surface-color);
	color: var(--text-color);
	cursor: pointer;
	transition: all 0.3s ease;
}

.version-button:hover {
	transform: translateY(-2px);
	background: rgba(var(--theme-color-rgb), 0.1);
}

.version-button .icon {
	width: 24px;
	height: 24px;
}

.page-container {
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background: var(--background-color);
}

.home-content {
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	padding: 2rem;
	position: relative;
}

/* 优化滚动条样式 */
.home-content::-webkit-scrollbar {
	width: 8px;
}

.home-content::-webkit-scrollbar-track {
	background: transparent;
}

.home-content::-webkit-scrollbar-thumb {
	background: rgba(var(--theme-color-rgb), 0.2);
	border-radius: 4px;
}

.home-content::-webkit-scrollbar-thumb:hover {
	background: rgba(var(--theme-color-rgb), 0.3);
}
</style>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue';
import { accountService } from '../services/accountService';
import Modal from '../components/Modal.vue';
import LoginSelector from '../components/LoginSelector.vue';
import OfflineLoginForm from '../components/OfflineLoginForm.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import MicrosoftLoginForm from '../components/MicrosoftLoginForm.vue';

// 使用账号服务
const { currentAccount, accounts } = accountService;

// 状态
const showLoginModal = ref(false);
const showAccountMenu = ref(false);
const loginType = ref('');
const showDeleteConfirm = ref(false);
const accountToDelete = ref(null);

// 添加离线登录状态
const showOfflineLogin = ref(false);

// 注入主页设置
const homeSettings = inject('homeSettings');

// 模拟最近游戏数据
const recentGames = ref([
	{
		id: 1,
		name: 'Minecraft 1.20.1',
		lastPlayed: '2小时前',
		icon: '/path/to/icon.png',
	},
	// ... 更多游戏
]);

// 方法
const switchAccount = (account) => {
	accountService.setCurrentAccount(account);
	showAccountMenu.value = false;
};

const removeAccount = (account) => {
	accountToDelete.value = account;
	showDeleteConfirm.value = true;
};

const cancelDelete = () => {
	showDeleteConfirm.value = false;
	accountToDelete.value = null;
};

const confirmDelete = async () => {
	if (!accountToDelete.value) return;

	try {
		await accountService.removeAccount(accountToDelete.value);
		if (accounts.value.length === 0) {
			showAccountMenu.value = false;
		}
	} catch (error) {
		console.error('删除账号失败:', error);
	} finally {
		showDeleteConfirm.value = false;
		accountToDelete.value = null;
	}
};

const launchGame = () => {
	if (!currentAccount.value) return;
	// 启动游戏的逻辑
};

// 关闭登录模态框
const closeLoginModal = () => {
	showLoginModal.value = false;
	loginType.value = '';
};

// 处理登录方式选择
const handleLoginSelect = (type) => {
	console.log('选择登录方式:', type);
	loginType.value = type;
	if (type === 'microsoft') {
		handleMicrosoftLogin();
	}
};

// 处理离线登录
const handleOfflineLogin = async (username) => {
	console.log('处理离线登录:', username);
	try {
		await accountService.loginOffline(username);
		closeLoginModal();
	} catch (error) {
		console.error('离线登录失败:', error);
	}
};

// Microsoft 登录状态
const microsoftLoginState = ref('initial');

// 处理 Microsoft 登录
const handleMicrosoftLogin = async () => {
	try {
		microsoftLoginState.value = 'processing';
		await accountService.initiateMicrosoftLogin();
		closeLoginModal();
	} catch (error) {
		console.error('Microsoft 登录失败:', error);
		microsoftLoginState.value = 'initial';
	}
};

// 处理 Microsoft 验证码
const handleMicrosoftCode = async (code) => {
	try {
		microsoftLoginState.value = 'processing';
		await accountService.completeMicrosoftLogin(code);
		closeLoginModal();
	} catch (error) {
		console.error('Microsoft 验证失败:', error);
		microsoftLoginState.value = 'code_input';
	}
};

// 初始化
onMounted(() => {
	// 点击外部关闭账号菜单
	document.addEventListener('click', (e) => {
		if (!e.target.closest('.account-section')) {
			showAccountMenu.value = false;
		}
	});
});
</script>
