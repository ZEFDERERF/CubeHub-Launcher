export class LaunchConfigGenerator {
	async generateConfig(version: string, type: string) {
		const config = {
			id: `${version}-${type}`,
			inheritsFrom: version,
			releaseTime: new Date().toISOString(),
			time: new Date().toISOString(),
			type: 'release',
			// 添加必要的启动参数
			arguments: {
				game: [],
				jvm: [],
			},
			libraries: [],
			mainClass: this.getMainClass(type),
			// ... 其他必要配置
		};

		return config;
	}

	private getMainClass(type: string) {
		switch (type) {
			case 'forge':
				return 'net.minecraft.launchwrapper.Launch';
			case 'fabric':
				return 'net.fabricmc.loader.launch.knot.KnotClient';
			default:
				return 'net.minecraft.client.main.Main';
		}
	}
}
