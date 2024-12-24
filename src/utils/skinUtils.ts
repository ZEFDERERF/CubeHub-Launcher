const SKIN_LIST = [
	'Alex.png',
	'Steve.png',
	'Ari.png',
	'Efe.png',
	'Kai.png',
	'Makena.png',
	'Noor.png',
	'Sunny.png',
	'Zuri.png',
];

export async function getRandomSkin() {
	const skins = [
		'Alex.png',
		'Steve.png',
		'Ari.png',
		'Efe.png',
		'Kai.png',
		'Makena.png',
		'Noor.png',
		'Sunny.png',
		'Zuri.png',
	];

	const randomSkin = skins[Math.floor(Math.random() * skins.length)];
	const skinPath = `/src/assets/IMG/Skins/${randomSkin}`;

	try {
		const headImage = await renderSkinHead(skinPath);
		return { skinPath, headImage };
	} catch (error) {
		console.error('渲染皮肤失败:', error);
		// 如果渲染失败，返回默认的 Steve 皮肤
		return {
			skinPath: '/src/assets/IMG/Skins/Steve.png',
			headImage: await renderSkinHead('/src/assets/IMG/Skins/Steve.png'),
		};
	}
}

async function getDefaultSkin() {
	const skinPath = '/src/assets/IMG/Skins/Steve.png';
	const skinImage = new Image();
	skinImage.src = skinPath;

	await new Promise((resolve, reject) => {
		skinImage.onload = resolve;
		skinImage.onerror = reject;
	});

	const headImage = await renderSkinHead(skinPath);

	return {
		skinPath,
		headImage,
	};
}

export async function extractHeadFromSkin(skinPath: string) {
	try {
		const skinImage = new Image();
		skinImage.crossOrigin = 'anonymous'; // 添加跨域支持
		skinImage.src = skinPath;

		await new Promise((resolve, reject) => {
			skinImage.onload = resolve;
			skinImage.onerror = reject;
		});

		return renderSkinHead(skinPath);
	} catch (error) {
		console.error('提取皮肤头像失败:', error);
		throw error;
	}
}

export async function renderSkinHead(skinUrl: string): Promise<string> {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d', { alpha: true });
	if (!ctx) {
		throw new Error('无法创建 Canvas 上下文');
	}

	// 设置更大的画布尺寸以提高清晰度
	canvas.width = 128;
	canvas.height = 128;

	// 加载皮肤图片
	const skinImage = new Image();
	skinImage.crossOrigin = 'anonymous';
	await new Promise((resolve, reject) => {
		skinImage.onload = resolve;
		skinImage.onerror = reject;
		skinImage.src = skinUrl;
	});

	// 禁用图像平滑，保持像素风格
	ctx.imageSmoothingEnabled = false;

	// 清空画布
	ctx.clearRect(0, 0, 128, 128);

	// 绘制头部主体（正面）
	ctx.drawImage(skinImage, 8, 8, 8, 8, 0, 0, 128, 128);
	// 绘制头部覆盖层（如果有的话）
	ctx.drawImage(skinImage, 40, 8, 8, 8, 0, 0, 128, 128);

	// 添加阴影效果
	const gradient = ctx.createLinearGradient(0, 96, 0, 128);
	gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
	gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 96, 128, 32);

	// 添加立体效果
	ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
	ctx.lineWidth = 1;
	ctx.strokeRect(32, 32, 64, 64);

	// 添加高光效果
	const highlightGradient = ctx.createLinearGradient(32, 32, 96, 96);
	highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
	highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
	ctx.fillStyle = highlightGradient;
	ctx.fillRect(32, 32, 64, 64);

	return canvas.toDataURL('image/png');
}
