import { createRouter, createWebHashHistory } from 'vue-router';
import Download from '../views/Download.vue';
import VersionDetail from '../views/download/VersionDetail.vue';

const routes = [
	{
		path: '/',
		redirect: '/download',
	},
	{
		path: '/download',
		name: 'Download',
		component: Download,
	},
	{
		path: '/download/:version',
		name: 'VersionMore',
		component: VersionDetail,
		props: true,
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

router.onError((error) => {
	console.error('Router error:', error);
});

router.beforeEach((to, from, next) => {
	console.log('Navigation Debug:', {
		to: {
			path: to.path,
			name: to.name,
			params: to.params,
			fullPath: to.fullPath,
			matched: to.matched.map((record) => ({
				path: record.path,
				name: record.name,
				params: record.params,
			})),
		},
		from: {
			path: from.path,
			name: from.name,
			params: from.params,
		},
	});
	next();
});

export default router;
