import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Download from '../views/Download.vue';
import Settings from '../views/Settings.vue';
import VersionMore from '../views/download/VersionMore.vue';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
		},
		{
			path: '/download',
			name: 'download',
			component: Download,
		},
		{
			path: '/settings',
			name: 'settings',
			component: Settings,
		},
		{
			path: '/download/:version/more',
			name: 'version-more',
			component: VersionMore,
			props: true,
		},
	],
});

export default router;
