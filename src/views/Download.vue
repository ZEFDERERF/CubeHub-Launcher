<template>
	<div class="page-container">
		<div class="download-container">
			<!-- 左侧版本切换侧边栏 -->
			<nav class="version-sidebar">
				<div class="version-categories">
					<button
						v-for="(count, type) in versionCounts"
						:key="type"
						class="version-nav-btn"
						:class="{ active: currentCategory === type }"
						@click="handleCategoryChange(type)"
						:disabled="isAnimating"
					>
						<div class="btn-content">
							<div class="icon-label">
								<!-- 正式版图标 -->
								<svg
									v-if="type === 'release'"
									class="nav-icon"
									width="24"
									height="24"
									viewBox="0 0 24 24"
								>
									<path
										fill="currentColor"
										d="M17 15.245v6.872a.5.5 0 0 1-.757.429L12 20l-4.243 2.546a.5.5 0 0 1-.757-.43v-6.87a8 8 0 1 1 10 0M12 15a6 6 0 1 0 0-12a6 6 0 0 0 0 12m0-2a4 4 0 1 1 0-8a4 4 0 0 1 0 8"
									/>
								</svg>
								<!-- 预览版图标 -->
								<svg
									v-else-if="type === 'snapshot'"
									class="nav-icon"
									width="24"
									height="24"
									viewBox="0 0 24 24"
								>
									<path
										fill="currentColor"
										d="M17 15.245v6.872a.5.5 0 0 1-.757.429L12 20l-4.243 2.546a.5.5 0 0 1-.757-.43v-6.87a8 8 0 1 1 10 0M9 16.42v3.049l3-1.8l3 1.8v-3.05A8 8 0 0 1 12 17a8 8 0 0 1-3-.581M12 15a6 6 0 1 0 0-12a6 6 0 0 0 0 12"
									/>
								</svg>
								<!-- 远古版图标 -->
								<svg
									v-else-if="type === 'old_alpha'"
									class="nav-icon"
									width="24"
									height="24"
									viewBox="0 0 24 24"
								>
									<path
										fill="currentColor"
										d="M20 3.107a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1zm-8.811 10.158L5 14.355v4.752h7.218zM19 5.107h-7.219l2.468 14H19zm-9.25 0H5v7.218l5.842-1.03z"
									/>
								</svg>
								<!-- 愚人节版本图标 -->
								<svg
									v-else-if="type === 'april_fools'"
									class="nav-icon"
									width="24"
									height="24"
									viewBox="0 0 24 24"
								>
									<path
										fill="currentColor"
										d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16m-4-7h8a4 4 0 0 1-8 0m0-2a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m8 0a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3"
									/>
								</svg>
								<span class="version-label">{{ getTabName(type) }}</span>
							</div>
							<span class="version-count">{{ count }}</span>
						</div>
					</button>
				</div>

				<!-- 添加 MOD 和整合包按钮 -->
				<div class="additional-options">
					<button
						class="version-nav-btn"
						:class="{ active: currentCategory === 'mods' }"
						@click="handleCategoryChange('mods')"
					>
						<div class="btn-content">
							<div class="icon-label">
								<svg
									class="nav-icon"
									width="24"
									height="24"
									viewBox="0 0 24 24"
								>
									<path
										fill="currentColor"
										d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18c-.21 0-.41-.06-.57-.18l-7.9-4.44A.991.991 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18c.21 0 .41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9M12 4.15L6.04 7.5L12 10.85l5.96-3.35L12 4.15M5 15.91l6 3.38v-6.71L5 9.21v6.7m14 0v-6.7l-6 3.37v6.71l6-3.38Z"
									/>
								</svg>
								<span class="version-label">MOD</span>
							</div>
						</div>
					</button>
					<button
						class="version-nav-btn"
						:class="{ active: currentCategory === 'modpacks' }"
						@click="handleCategoryChange('modpacks')"
					>
						<div class="btn-content">
							<div class="icon-label">
								<svg
									class="nav-icon"
									width="24"
									height="24"
									viewBox="0 0 24 24"
								>
									<path
										fill="currentColor"
										d="m10.414 3l2 2H21a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM18 18h-4v-3h2v-2h-2v-2h2V9h-2V7h-2.414l-2-2H4v14h16V7h-4v2h2v2h-2v2h2z"
									/>
								</svg>
								<span class="version-label">整合包</span>
							</div>
						</div>
					</button>
				</div>
			</nav>

			<!-- 主内容区域 -->
			<div class="main-content">
				<!-- 搜索栏 -->
				<div class="search-bar">
					<div class="search-wrapper">
						<input
							v-model="searchQuery"
							type="text"
							:placeholder="`搜索${currentCategory === 'mods' ? 'MOD' : currentCategory === 'modpacks' ? '整合包' : '版本'}...`"
							class="search-input"
						/>
					</div>
				</div>

				<!-- 版本列表 -->
				<div class="version-list-container">
					<div class="scroll-buttons">
						<button class="scroll-button refresh" @click="handleRefresh" title="刷新">
							<svg viewBox="0 0 24 24">
								<path fill="currentColor" d="M12 20q-3.35 0-5.675-2.325T4 12q0-3.35 2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V4h2v7h-7V9h4.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12q0 2.5 1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325T12 20Z"/>
							</svg>
						</button>
						<button
							v-show="showTopButton"
							class="action-btn to-top"
							@click="scrollToTop"
							title="返回顶部"
						>
							<svg width="24" height="24" viewBox="0 0 24 24">
								<path fill="currentColor" d="M3 3h18v2H3zm5 8v10H6V11H3l4-4l4 4zm10 0v10h-2V11h-3l4-4l4 4z"/>
							</svg>
						</button>
					</div>
					<div v-if="loading" class="loading-container">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="128"
							height="128"
							viewBox="0 0 24 24"
							class="loading-svg"
						>
							<path
								fill="none"
								stroke="currentColor"
								stroke-dasharray="16"
								stroke-dashoffset="16"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 3c4.97 0 9 4.03 9 9"
							>
								<animate
									fill="freeze"
									attributeName="stroke-dashoffset"
									dur="0.2s"
									values="16;0"
								/>
								<animateTransform
									attributeName="transform"
									dur="1.5s"
									repeatCount="indefinite"
									type="rotate"
									values="0 12 12;360 12 12"
								/>
							</path>
						</svg>
						<span class="loading-text">{{ currentCategory === 'mods' ? '正在加载MOD列表...' : currentCategory === 'modpacks' ? '正在加载整合包列表...' : '正在加载版本列表...' }}</span>
					</div>
					<div v-else-if="error" class="error">{{ error }}</div>
					<div v-else-if="filteredVersions.length === 0" class="no-results">
						{{ currentCategory === 'mods' ? '没有找到MOD' : currentCategory === 'modpacks' ? '没有找到整合包' : '没有找到版本' }}
					</div>
					<div v-else class="version-list">
						<div
							v-for="(version, index) in filteredVersions"
							:key="version.id"
							class="version-item"
							:class="{ selected: selectedVersion === version.id }"
							:style="{ '--index': index }"
							@click="handleVersionClick(version, currentCategory)"
						>
							<div class="version-info-container">
								<div class="version-left">
									<template v-if="currentCategory === 'mods'">
										<img
											:src="getModIcon(version).src"
											@error="getModIcon(version).error"
											:alt="version.title"
											class="version-icon mod-icon"
										/>
										<div class="version-id">{{ version.title }}</div>
									</template>
									<template v-else-if="currentCategory === 'modpacks'">
										<img
											:src="getModIcon(version).src"
											@error="getModIcon(version).error"
											:alt="version.title"
											class="version-icon mod-icon"
										/>
										<div class="version-id">{{ version.title }}</div>
									</template>
									<template v-else>
										<img
											:src="getVersionIcon(version)"
											:alt="version.type"
											class="version-icon"
										/>
										<div class="version-id">{{ version.id }}</div>
									</template>
								</div>
								<div class="version-center">
									<span v-if="currentCategory !== 'mods' && currentCategory !== 'modpacks'" class="version-type">
										{{ getVersionTypeName(version.type) }}
									</span>
								</div>
								<div class="version-right">
									<template v-if="currentCategory === 'mods' || currentCategory === 'modpacks'">
										最后更新时间: {{ version.releaseTime }}
									</template>
									<template v-else>
										发布时间: {{ version.releaseTime }}
									</template>
								</div>
							</div>
						</div>
					</div>

					<!-- 修改分页组件 -->
					<div v-if="!loading && totalPages > 1" class="pagination-container">
						<div class="pagination">
							<button
								class="page-btn"
								:disabled="currentPage === 1"
								@click="handlePageChange(1)"
								title="跳转到第一页"
							>
								<svg class="page-icon" viewBox="0 0 24 24">
									<path fill="currentColor" d="M18.41 7.41L17 6l-6 6l6 6l1.41-1.41L13.83 12l4.58-4.59m-6 0L11 6l-6 6l6 6l1.41-1.41L7.83 12l4.58-4.59z"/>
								</svg>
							</button>

						<button
							class="page-btn"
							:disabled="currentPage === 1"
							@click="handlePageChange(currentPage - 1)"
						>
							<svg class="page-icon" viewBox="0 0 24 24">
								<path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z"/>
							</svg>
						</button>

						<button
							v-for="page in pageNumbers"
							:key="page"
							class="page-btn"
							:class="{ active: currentPage === page }"
							@click="handlePageChange(page)"
						>
							<span>{{ page }}</span>
						</button>

						<button
							class="page-btn"
							:disabled="currentPage === totalPages"
							@click="handlePageChange(currentPage + 1)"
						>
							<svg class="page-icon" viewBox="0 0 24 24">
								<path fill="currentColor" d="M8.59 16.59L10 18l6-6l-6-6L8.59 7.41L13.17 12z"/>
							</svg>
						</button>
						</div>
						<div class="pagination-actions">
							<button class="action-btn refresh" @click="handleRefresh" title="刷新">
								<svg viewBox="0 0 24 24">
									<path fill="currentColor" d="M12 20q-3.35 0-5.675-2.325T4 12q0-3.35 2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V4h2v7h-7V9h4.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12q0 2.5 1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325T12 20Z"/>
								</svg>
							</button>
							<button
								v-show="showTopButton"
								class="action-btn to-top"
								@click="scrollToTop"
								title="返回顶部"
							>
								<svg width="24" height="24" viewBox="0 0 24 24">
									<path fill="currentColor" d="M3 3h18v2H3zm5 8v10H6V11H3l4-4l4 4zm10 0v10h-2V11h-3l4-4l4 4z"/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$animation-curve: cubic-bezier(0.34, 1.56, 0.64, 1);

.page-container {
	height: 100%;
	display: flex;
}

.download-container {
	display: flex;
	width: 100%;
	height: 100%;
}

.version-sidebar {
	width: 200px;
	background: var(--surface-color);
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	border-right: 1px solid rgba(128, 128, 128, 0.1);
	box-shadow: 4px 0 16px rgba(0, 0, 0, 0.05);
	padding: 1rem 0;
	position: relative;
	height: 100%;
}

.main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 2rem;
	gap: 1rem;
	background: var(--background-color);
	height: 100vh;
	overflow: hidden;
}

.search-bar {
	background: var(--surface-color);
	border-radius: 8px;
	padding: 0.5rem;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	margin-bottom: 1rem;
}

.search-wrapper {
	position: relative;
	display: flex;
	align-items: center;
}

.search-input {
	width: 100%;
	padding: 0.75rem 1rem;
	border: none;
	border-radius: 6px;
	background: var(--background-color);
	color: var(--text-color);
	font-size: 0.95rem;
	transition: all 0.3s ease;
}

.version-list-container {
	display: flex;
	flex-direction: column;
	height: calc(100vh - 200px);
	overflow-y: auto;
	position: relative;
}

.version-list {
	flex: 1;
	padding: 1rem;
}

.version-item {
	background: var(--surface-color);
	border-radius: 12px;
	padding: 1rem 1.25rem;
	display: flex;
	align-items: center;
	gap: 1.5rem;
	position: relative;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	border: 1px solid rgba(var(--theme-color-rgb), 0.1);
	cursor: pointer;
	margin-top: -4px;
	will-change: transform, box-shadow, opacity;
	animation: slideIn 0.5s $animation-curve backwards;
	animation-delay: calc(var(--index) * 0.05s);
	transition:
		transform 0.5s $animation-curve,
		box-shadow 0.5s $animation-curve,
		border-color 0.3s ease;
}

@keyframes slideIn {
	0% {
		opacity: 0;
		transform: translateX(-50px) scale(0.9);
	}
	100% {
		opacity: 1;
		transform: translateX(0) scale(1);
	}
}

.version-item:hover {
	transform: translateX(-8px) scale(1.02);
	box-shadow: 0 8px 24px rgba(var(--theme-color-rgb), 0.15);
	z-index: 2;
}

.version-item.selected {
	transform: translateX(-16px) scale(1.03);
	box-shadow: 0 12px 32px rgba(var(--theme-color-rgb), 0.2);
	border-color: var(--theme-color);
	border-width: 2px;
	z-index: 3;
}

.version-item.selected:hover {
	transform: translateX(-20px) scale(1.04);
	box-shadow: 0 16px 40px rgba(var(--theme-color-rgb), 0.25);
}

.version-id {
	font-size: 1.1rem;
	font-weight: 500;
	color: var(--theme-color);
	min-width: 80px;
	transition: transform 0.3s ease;
}

.version-item.selected .version-id {
	transform: scale(1.05);
}

.version-info {
	flex: 1;
	display: flex;
	gap: 1rem;
	align-items: center;
	transition: transform 0.3s ease;
}

.version-item.selected .version-info {
	transform: translateX(4px);
}

.version-type {
	padding: 0.25rem 0.75rem;
	background: rgba(var(--theme-color-rgb), 0.1);
	color: var(--theme-color);
	border-radius: 8px;
	font-size: 0.9rem;
	transition: background-color 0.3s ease;
	white-space: nowrap;
}

.version-item.selected .version-type {
	background: rgba(var(--theme-color-rgb), 0.2);
}

.version-date {
	color: var(--secondary-text);
	font-size: 0.9rem;
}

.version-actions {
	display: flex;
	gap: 0.5rem;
	opacity: 0.8;
	transition: all 0.3s $animation-curve;
}

.version-item:hover .version-actions {
	opacity: 1;
	transform: scale(1.02);
}

.version-item.selected .version-actions {
	opacity: 1;
	transform: scale(1.05);
}

.download-btn,
.more-btn {
	padding: 0.5rem 1rem;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 0.9rem;
	transition: all 0.3s ease;
	white-space: nowrap;
}

.download-btn {
	background: var(--theme-color);
	color: white;
}

.download-btn:hover {
	filter: brightness(1.1);
}

.more-btn {
	background: rgba(var(--theme-color-rgb), 0.1);
	color: var(--theme-color);
	text-decoration: none;
}

.more-btn:hover {
	background: rgba(var(--theme-color-rgb), 0.15);
}

.version-nav-btn {
	padding: 0.75rem 2rem;
	border: none;
	background: transparent;
	color: var(--text-color);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 0.95rem;
	position: relative;
	overflow: hidden;
	transition: all 0.3s $animation-curve;

	&::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: var(--theme-color);
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 0;
	}

	&:hover {
		transform: translateX(8px);

		&::before {
			opacity: 0.1;
		}
	}

	&.active {
		color: white;
		transform: translateX(8px);

		&::before {
			opacity: 1;
		}

		// 发光效果
		box-shadow:
			0 0 20px rgba(var(--theme-color-rgb), 0.3),
			0 0 40px rgba(var(--theme-color-rgb), 0.1),
			inset 0 0 10px rgba(255, 255, 255, 0.2);

		// 内部光晕
		&::after {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
			z-index: 1;
			opacity: 0.5;
		}

		.version-count {
			background: rgba(255, 255, 255, 0.2);
			box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
		}

		.nav-icon {
			filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
		}
	}
}

.btn-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	position: relative;
	z-index: 2;
}

.icon-label {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	flex: 1;
}

.nav-icon {
	width: 1.25rem;
	height: 1.25rem;
	transition: all 0.3s $animation-curve;
	flex-shrink: 0;
}

.version-nav-btn:hover .nav-icon {
	transform: scale(1.2) rotate(5deg);
}

.version-nav-btn.active .nav-icon {
	transform: scale(1.2);
	filter: brightness(1.2);
}

.version-label,
.version-count {
	position: relative;
	z-index: 2;
}

.version-count {
	background: rgba(var(--theme-color-rgb), 0.1);
	padding: 0.2rem 0.6rem;
	border-radius: 12px;
	font-size: 0.85rem;
	transition: all 0.3s ease;
}

.version-label,
.version-count {
	position: relative;
	z-index: 1;
}

.version-count {
	background: rgba(var(--theme-color-rgb), 0.1);
	padding: 0.2rem 0.6rem;
	border-radius: 12px;
	font-size: 0.85rem;
}

.version-nav-btn.active .version-count {
	background: rgba(255, 255, 255, 0.2);
}

.version-list-enter-active,
.version-list-leave-active {
	transition: all 0.3s $animation-curve;
	position: absolute;
	width: 100%;
}

.version-list-enter-from {
	opacity: 0;
	transform: translateX(-30px);
}

.version-list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

.version-list-move {
	transition: transform 0.5s $animation-curve;
}

.version-list-container::-webkit-scrollbar {
	width: 8px;
}

.version-list-container::-webkit-scrollbar-track {
	background: transparent;
}

.version-list-container::-webkit-scrollbar-thumb {
	background: rgba(var(--theme-color-rgb), 0.2);
	border-radius: 4px;
}

.version-list-container::-webkit-scrollbar-thumb:hover {
	background: rgba(var(--theme-color-rgb), 0.3);
}

/* 加载状态样式 */
.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	gap: 2rem;
	color: var(--theme-color);
	animation: fadeIn 0.3s ease;
}

.loading-svg {
	color: var(--theme-color);
	opacity: 0.8;
	filter: drop-shadow(0 0 8px rgba(var(--theme-color-rgb), 0.3));
}

.loading-text {
	font-size: 1.1rem;
	color: var(--text-color);
	opacity: 0.8;
	animation: pulse 2s ease-in-out infinite;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(-20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes pulse {
	0%,
	100% {
		opacity: 0.8;
	}
	50% {
		opacity: 0.5;
	}
}

/* 错误状态样式 */
.error {
	text-align: center;
	padding: 2rem;
	color: #ff4d4f;
	font-size: 1.1rem;
	background: rgba(255, 77, 79, 0.1);
	border-radius: 12px;
	margin: 2rem;
	animation: fadeIn 0.3s ease;
}

/* 无结果状态样式 */
.no-results {
	text-align: center;
	padding: 2rem;
	color: var(--text-color);
	font-size: 1.1rem;
	background: rgba(var(--theme-color-rgb), 0.1);
	border-radius: 12px;
	margin: 2rem;
	animation: fadeIn 0.3s ease;
}

.version-sidebar {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
}

.version-categories {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	flex: 1;
}

.additional-options {
	position: absolute;
	bottom: 120px;  /* 调整这个值来控制距离底部的距离 */
	left: 0;
	right: 0;
	padding-top: 1rem;
	border-top: 1px solid rgba(128, 128, 128, 0.1);
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	background: var(--surface-color);
}

.version-info-container {
	display: flex;
	align-items: center;
	gap: 1rem;
	flex: 1;
	justify-content: space-between;
}

.version-left {
	display: flex;
	align-items: center;
	gap: 1rem;
	min-width: 200px;
}

.version-center {
	flex: 1;
	display: flex;
	justify-content: center;
}

.version-right {
	min-width: 240px;
	text-align: right;
	color: var(--secondary-text);
	font-size: 0.9rem;
	white-space: nowrap;
}

.version-icon {
	width: 32px;
	height: 32px;
	object-fit: contain;
	image-rendering: pixelated;
}

.mod-icon {
	border-radius: 6px;
	background: var(--background-color);
	padding: 2px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
}

.version-item:hover .mod-icon {
	transform: scale(1.1);
	box-shadow: 0 4px 8px rgba(var(--theme-color-rgb), 0.2);
}

.version-item.selected .mod-icon {
	transform: scale(1.15);
	box-shadow: 0 6px 12px rgba(var(--theme-color-rgb), 0.3);
}

/* 修改分页相关样式 */
.pagination-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 2rem;
	padding: 1rem;
}

.pagination {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin: 0 auto;
}

.pagination-actions {
	display: flex;
	gap: 0.5rem;
}

.page-btn {
	min-width: 52px;
	height: 52px;
	padding: 0 1.2rem;
	border: none;
	border-radius: 8px;
	background: var(--surface-color);
	color: var(--text-color);
	font-size: 1.4rem;
	font-weight: 500;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s $animation-curve;
	position: relative;
	overflow: hidden;
	box-shadow: 0 2px 8px rgba(var(--theme-color-rgb), 0.1);
}

.page-btn::before {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: var(--theme-color);
	opacity: 0;
	transition: opacity 0.3s ease;
	z-index: 0;
}

.page-btn:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(var(--theme-color-rgb), 0.2);
}

.page-btn:hover:not(:disabled)::before {
	opacity: 0.1;
}

.page-btn.active {
	color: white;
	transform: scale(1.1);
	box-shadow: 0 4px 16px rgba(var(--theme-color-rgb), 0.3);
}

.page-btn.active::before {
	opacity: 1;
}

.page-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.page-icon {
	width: 40px;
	height: 40px;
	position: relative;
	z-index: 1;
}

.action-btn {
	width: 52px;
	height: 52px;
	border: none;
	border-radius: 8px;
	background: var(--surface-color);
	color: var(--text-color);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s $animation-curve;
	position: relative;
	overflow: hidden;
	box-shadow: 0 2px 8px rgba(var(--theme-color-rgb), 0.1);
}

.action-btn::before {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: var(--theme-color);
	opacity: 0;
	transition: opacity 0.3s ease;
	z-index: 0;
}

.action-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(var(--theme-color-rgb), 0.2);
}

.action-btn:hover::before {
	opacity: 0.1;
}

.action-btn svg {
	width: 40px;
	height: 40px;
	position: relative;
	z-index: 1;
	transition: transform 0.3s $animation-curve;
}

.action-btn:hover svg {
	transform: scale(1.2);
}

/* 删除原有的滚动按钮样式 */
.scroll-buttons {
	display: none;
}

.page-btn span {
	position: relative;
	z-index: 1;
}

/* 添加点击动画样式 */
.action-btn.to-top.clicked {
	animation: topButtonClick 0.5s $animation-curve;
}

@keyframes topButtonClick {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(0.9) translateY(2px);
	}
	100% {
		transform: scale(1);
	}
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 版本类型和计数
const currentCategory = ref('release');
const versionCounts = ref({
	release: 91,
	snapshot: 631,
	old_alpha: 61,
	april_fools: 8,
});

// 搜索和版本状态
const searchQuery = ref('');
const versions = ref([]);
const loading = ref(true);
const error = ref(null);

// 添加 MOD 和整合包相关的状态
const modCount = ref(0);
const modpackCount = ref(0);
const mods = ref([]);
const modpacks = ref([]);

// 在 script setup 部分添加分页相关的状态
const currentPage = ref(1);
const pageSize = 20;
const totalPages = ref(1);

// 修改版本类型的显示名称函数
const getTabName = (type) => {
	const names = {
		release: '正式版',
		snapshot: '快照版',
		old_alpha: '远古版',
		april_fools: '愚人节版本',
		mods: 'MOD',
		modpacks: '整合包'
	};
	return names[type];
};

// 获取版本类型的显示名称
const getVersionTypeName = (type) => {
	const typeNames = {
		release: '正式版',
		snapshot: '快照版',
		pre_release: '预发布版',
		release_candidate: '候选版',
		old_alpha: '远古版本(Alpha)',
		old_beta: '远古版本(Beta)',
		april_fools: '愚人节版本'
	};
	return typeNames[type] || type;
};

// 修改版本匹配逻辑
const isVersionMatch = (version) => {
	const releaseDate = new Date(version.releaseTime);
	const isAprilFools = releaseDate.getMonth() === 3 && releaseDate.getDate() === 1;

	// 如果是愚人节版本，优先归类到愚人节分类
	if (currentCategory.value === 'april_fools') {
		return isAprilFools;
	}

	// 如果是愚人节版本，在其他分类中不显示
	if (isAprilFools) {
		return false;
	}

	switch (currentCategory.value) {
		case 'release':
			return version.type === 'release';
		case 'snapshot':
			return (
				version.type === 'snapshot' ||
				version.type === 'pre_release' ||
				version.type === 'release_candidate'
			);
		case 'old_alpha':
			return (
				version.type === 'old_alpha' ||
				version.type === 'old_beta' ||
				version.id.toLowerCase().startsWith('a') ||
				version.id.toLowerCase().startsWith('b')
			);
		default:
			return true;
	}
};

// 修改过滤版本列表的计算属性
const filteredVersions = computed(() => {
	let items = [];

	if (currentCategory.value === 'mods') {
		items = mods.value;
	} else if (currentCategory.value === 'modpacks') {
		items = modpacks.value;
	} else {
		// 先过滤符合条件的版本
		items = versions.value.filter((version) => isVersionMatch(version));

		// 如果有搜索词，进行搜索过滤
		if (searchQuery.value) {
			items = items.filter(item =>
				item.id.toLowerCase().includes(searchQuery.value.toLowerCase())
			);
		}

		// 计算总页数
		totalPages.value = Math.ceil(items.length / pageSize);

		// 分页处理
		const start = (currentPage.value - 1) * pageSize;
		const end = start + pageSize;
		items = items.slice(start, end);
	}

	return items;
});

// 获取版本列表
const fetchVersions = async () => {
	try {
		loading.value = true;
		const response = await fetch(
			'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json'
		);
		if (!response.ok) throw new Error('Failed to fetch versions');

		const data = await response.json();
		versions.value = data.versions.map((v) => ({
			id: v.id,
			type: v.type,
			releaseTime: new Date(v.releaseTime).toLocaleString('zh-CN', { hour12: false }),
			url: v.url,
		}));

		updateVersionCounts();
	} catch (err) {
		error.value = '获取版本列表失败: ' + err.message;
		console.error('Error fetching versions:', err);
	} finally {
		loading.value = false;
	}
};

// 更新版本计数逻辑
const updateVersionCounts = () => {
	const counts = {
		release: 0,
		snapshot: 0,
		old_alpha: 0,
		april_fools: 0,
	};

	versions.value.forEach((version) => {
		const releaseDate = new Date(version.releaseTime);
		const isAprilFools = releaseDate.getMonth() === 3 && releaseDate.getDate() === 1;

		if (isAprilFools) {
			counts.april_fools++;
			return; // 愚人节版本只计入愚人节分类
		}

		if (version.type === 'release') {
			counts.release++;
		} else if (
			version.type === 'snapshot' ||
			version.type === 'pre_release' ||
			version.type === 'release_candidate'
		) {
			counts.snapshot++;
		} else if (
			version.type === 'old_alpha' ||
			version.type === 'old_beta' ||
			version.id.toLowerCase().startsWith('a') ||
			version.id.toLowerCase().startsWith('b')
		) {
			counts.old_alpha++;
		}
	});

	versionCounts.value = counts;
};

// 添加动画状态控制
const isAnimating = ref(false);

// 修改版本切换处理函数
const handleCategoryChange = async (type) => {
	if (isAnimating.value) return;
	isAnimating.value = true;

	// 如果点击的是当前分类，则刷新数据
	if (currentCategory.value === type) {
		loading.value = true;
		if (type === 'mods') {
			await fetchMods(currentPage.value);
		} else if (type === 'modpacks') {
			await fetchModpacks(currentPage.value);
		} else {
			await fetchVersions();
		}
		loading.value = false;
	} else {
		// 切换分类
		currentCategory.value = type;
		currentPage.value = 1; // 重置页码

		// 重置滚动位置
		const container = document.querySelector('.version-list-container');
		if (container) {
			container.scrollTop = 0;
		}

		// 根据类型加载不同的数据
		loading.value = true;
		if (type === 'mods') {
			await fetchMods(1);
		} else if (type === 'modpacks') {
			await fetchModpacks(1);
		} else {
			await fetchVersions();
		}
		loading.value = false;
	}

	// 触发重新动画
	if (type === 'mods') {
		versions.value = [...mods.value];
	} else if (type === 'modpacks') {
		versions.value = [...modpacks.value];
	} else {
		versions.value = [...versions.value];
	}

	setTimeout(() => {
		isAnimating.value = false;
	}, 500); // 动画持续时间后解锁
};

// 添加选中状态
const selectedVersion = ref(null);

// 添加版本点击处理函数
const handleVersionClick = (object, currentCategory) => {
	try {
		// 根据Category类型导航到不同的页面
		switch (currentCategory) {
		    case 'mods':
				router.push({ name: 'ModDetail', params: { id: object.id } });
				break;
			case 'modpacks':
				router.push({ name: 'ModpackDetail', params: { id: object.id } });
				break;
			default:
				router.push({ name: 'VersionDetail', params: { version: object.id } });
				break;
		}
		// Debug日志，以及导航目标
		console.debug('Info:', object);
		console.debug(`Navigating to ${currentCategory}Detail page for ${object.id}`);
	} catch (error) {
		console.error('Navigation error:', error);
	}
};

// 添加获取 MOD 列表的函数
const fetchMods = async (page = 1) => {
	try {
		loading.value = true;
		const offset = (page - 1) * pageSize;
		const response = await fetch(`https://api.modrinth.com/v2/search?limit=${pageSize}&offset=${offset}&index=downloads`);
		if (!response.ok) throw new Error('Failed to fetch mods');

		const data = await response.json();
		mods.value = data.hits.map(mod => ({
			id: mod.project_id,
			title: mod.title,
			description: mod.description,
			downloads: mod.downloads,
			author: mod.author,
			versions: mod.versions,
			icon_url: mod.icon_url,
			releaseTime: new Date(mod.date_modified).toLocaleString('zh-CN', { hour12: false })
		}));
		modCount.value = data.total_hits;
		totalPages.value = Math.ceil(data.total_hits / pageSize);
	} catch (err) {
		error.value = '获取MOD列表失败: ' + err.message;
		console.error('Error fetching mods:', err);
	} finally {
		loading.value = false;
	}
};

// 修改整合包数据获取函数
const fetchModpacks = async (page = 1) => {
	try {
		loading.value = true;
		const offset = (page - 1) * pageSize;
		const response = await fetch(`https://api.modrinth.com/v2/search?limit=${pageSize}&offset=${offset}&facets=[["project_type:modpack"]]`);
		if (!response.ok) throw new Error('Failed to fetch modpacks');

		const data = await response.json();
		modpacks.value = data.hits.map(pack => ({
			id: pack.project_id,
			title: pack.title,
			description: pack.description,
			downloads: pack.downloads,
			author: pack.author,
			versions: pack.versions,
			icon_url: pack.icon_url,
			releaseTime: new Date(pack.date_modified).toLocaleString('zh-CN', { hour12: false })
		}));
		modpackCount.value = data.total_hits;
		totalPages.value = Math.ceil(data.total_hits / pageSize);
	} catch (err) {
		error.value = '获取整合包列表失败: ' + err.message;
		console.error('Error fetching modpacks:', err);
	} finally {
		loading.value = false;
	}
};

// 在 script setup 部分添加图标映射
const getVersionIcon = (version) => {
	const releaseDate = new Date(version.releaseTime);
	const isAprilFools = releaseDate.getMonth() === 3 && releaseDate.getDate() === 1;

	if (isAprilFools) {
		return '/public/IMG/Icons/GoldBlock.png';
	}

	switch (version.type) {
		case 'release':
			return '/public/IMG/Icons/Grass.png';
		case 'snapshot':
		case 'pre_release':
		case 'release_candidate':
			return '/public/IMG/Icons/GrassPath.png';
		case 'old_alpha':
		case 'old_beta':
			return '/public/IMG/Icons/CobbleStone.png';
		default:
			return '/public/IMG/Icons/Grass.png';
	}
};

// 在 script setup 部分添加图标处理函数
const getModIcon = (mod) => {
	if (mod.icon_url) {
		return {
			src: mod.icon_url,
			error: (e) => {
				e.target.src = '/public/IMG/Icons/NoIcon.png';
			}
		};
	}
	return {
		src: '/public/IMG/Icons/NoIcon.png',
		error: null
	};
};

// 添加页面切换处理函数
const handlePageChange = async (page) => {
	if (page < 1 || page > totalPages.value) return;

	// 滚动到顶部
	const container = document.querySelector('.version-list-container');
	if (container) {
		container.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	// 等待滚动完成后再加载新数据
	await new Promise(resolve => setTimeout(resolve, 300));

	currentPage.value = page;
	if (currentCategory.value === 'mods') {
		await fetchMods(page);
	} else if (currentCategory.value === 'modpacks') {
		await fetchModpacks(page);
	}
	// MC版本列表不需要重新加载，因为数据已经在本地
};

// 添加获取分页数组的计算属性
const pageNumbers = computed(() => {
	const current = currentPage.value;
	const total = totalPages.value;
	const pages = [];

	if (total <= 5) {
		for (let i = 1; i <= total; i++) {
			pages.push(i);
		}
	} else if (current <= 3) {
		pages.push(1, 2, 3, 4, 5);
	} else if (current >= total - 2) {
		for (let i = total - 4; i <= total; i++) {
			pages.push(i);
		}
	} else {
		pages.push(current - 2, current - 1, current, current + 1, current + 2);
	}

	return pages;
});

// 添加显示返回顶部按钮的状态
const showTopButton = ref(false);

// 添加滚动处理函数
const handleScroll = (e) => {
	showTopButton.value = e.target.scrollTop > 300;
};

// 添加刷新处理函数
const handleRefresh = async () => {
	const container = document.querySelector('.version-list-container');
	if (container) {
		container.scrollTop = 0;
	}

	loading.value = true;
	if (currentCategory.value === 'mods') {
		await fetchMods(currentPage.value);
	} else if (currentCategory.value === 'modpacks') {
		await fetchModpacks(currentPage.value);
	} else {
		await fetchVersions();
	}
};

// 修改返回顶部函数
const scrollToTop = () => {
	const container = document.querySelector('.version-list-container');
	if (container) {
		// 添加动画类
		const button = document.querySelector('.action-btn.to-top');
		if (button) {
			button.classList.add('clicked');
			setTimeout(() => {
				button.classList.remove('clicked');
			}, 500); // 动画持续时间后移除类
		}

		// 平滑滚动到顶部
		container.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}
};

// 添加生命周期钩子
onMounted(() => {
	const container = document.querySelector('.version-list-container');
	if (container) {
		container.addEventListener('scroll', handleScroll);
	}
});

onUnmounted(() => {
	const container = document.querySelector('.version-list-container');
	if (container) {
		container.removeEventListener('scroll', handleScroll);
	}
});

// 初始化
fetchVersions();
</script>
