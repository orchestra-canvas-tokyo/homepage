<script lang="ts">
	/** パンくずの各要素を定義する配列 */
	export let segments: { title: string; lang: 'en' | 'ja'; url?: string }[] = [];
</script>

<!--
@component
現在いる階層を示す、パンくずリスト(Breadcrumb)
- lang属性は日本語を考慮したフォントで描画するかどうかを決定する。

@example
```svelte
<Breadcrumb segments=[
	{
	  title: 'ホーム',
	  lang: 'ja'
	}, {
		title: 'a linked item',
		lang: 'en',
		url: 'https://example.com/'
	}
]>
```
-->

<nav aria-label="breadcrumb" class="hide-on-mobile">
	<ol>
		{#each segments as segment}
			<li>
				{#if segment.url}
					<a href={segment.url} class={segment.lang}>{segment.title}</a>
				{:else}
					<span class={segment.lang}>{segment.title}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>

<style>
	a {
		border-bottom: none;
	}

	nav {
		font-size: 0.875rem;
	}
	ol {
		list-style: none;
		padding: 0;
		display: flex;
		align-items: center;
	}
	li {
		display: flex;
		align-items: center;
		font-size: 0.9em;
	}
	li:not(:last-child)::after {
		display: inline-block;
		margin: 0 14px 0 7px;
		height: 8px;
		width: 8px;
		border-right: solid 1px;
		border-bottom: solid 1px;
		content: '';
		transform: rotate(-45deg);
	}

	@media (max-width: 950px) {
		.hide-on-mobile {
			display: none;
		}
	}
</style>
