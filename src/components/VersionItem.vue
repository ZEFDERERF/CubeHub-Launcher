<template>
	<div class="version-item">
		<router-link :to="`/download/${category}/${version.id}/more`" class="more-btn">
			额外选项
		</router-link>
	</div>
</template>

<script>
export default {
	props: {
		version: Object,
		category: String,
	},
};
</script>

<style scoped>
.version-item {
	padding: 0.5rem 0.75rem;
	margin-bottom: 0.35rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-radius: 4px;
	transition: background-color 0.2s;
	color: var(--text-color);
}

.version-item:hover {
	background: var(--surface-color);
}

.version-name {
	font-size: 1rem;
	font-weight: 500;
	color: var(--text-color);
}

.version-tag {
	background: var(--primary-color);
	color: white;
	padding: 0.25rem 0.5rem;
	border-radius: 4px;
	font-size: 0.9rem;
	margin-left: 0.5rem;
}

.version-type {
	color: var(--secondary-text-color);
	font-size: 0.9rem;
	margin-left: 0.5rem;
}

.version-date {
	color: var(--secondary-text-color);
	font-size: 0.9rem;
}

.more-btn {
	padding: 0.5rem 1rem;
	background: var(--surface-color);
	border: 1px solid var(--border-color);
	border-radius: 4px;
	color: var(--text-color);
	text-decoration: none;
	transition: all 0.3s;
}

.more-btn:hover {
	background: var(--hover-color);
	border-color: var(--primary-color);
	color: var(--primary-color);
}
</style>
