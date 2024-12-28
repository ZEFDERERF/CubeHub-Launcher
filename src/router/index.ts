import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Download from '../views/Download.vue';
import Settings from '../views/Settings.vue';
import VersionMore from '../views/download/VersionDetail.vue';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home,
		},
		{
			path: '/download',
			name: 'Download',
			component: Download,
			children: [
				{
					path: ':version/more',
					name: 'VersionMore',
					component: VersionMore,
				},
			],
		},
		{
			path: '/settings',
			name: 'Settings',
			component: Settings,
		},
	],
});

export default router;
