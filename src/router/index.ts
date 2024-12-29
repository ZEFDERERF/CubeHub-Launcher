import { vue } from '@vitejs/plugin-vue';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Download from '../views/Download.vue';
import Settings from '../views/Settings.vue';
import VersionDetail from '../views/download/VersionDetail.vue';
import ModDetail from '../views/download/ModVersionDetail.vue';
import ModPackDetail from '../views/download/ModPacksDetail.vue';
// import VersionList from '../views/download/VersionList.vue';

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
			component: Download
		},
		{
			path: '/download/game/:version',
			name: 'VersionDetail',
			component: VersionDetail
		},
		{
			path: '/download/mod/:id',
			name: 'ModDetail',
			component: ModDetail
		},
		{
			path: '/download/modpack/:id',
			name: 'ModPackDetail',
			component: ModPackDetail
		},
		{
			path: '/settings',
			name: 'Settings',
			component: Settings,
		},
	],
});

router.onError((err: any) => {
	console.error("Router error: ", err);
});

router.beforeEach((to: any, from: any, next: any) => {
    console.debug('Navigation Debug:', {
        to: {
            path: to.path,
            name: to.name,
            params: to.params,
            fullPath: to.fullPath,
            matched: to.matched.map((record:any) => ({
                path: record.path,
                name: record.name,
                params: record.params
            }))
        },
        from: {
            path: from.path,
            name: from.name,
            params: from.params
        }
    });
    next();
});

export default router;
