<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import organizationChart from './organization-chart.png';
</script>

<Meta title="Concepts" canonical="/about/concepts" />

<Breadcrumb
	segments={[
		{
			title: 'home',
			lang: 'en',
			url: '/'
		},
		{
			title: 'about',
			lang: 'en'
		},
		{
			title: 'concepts',
			lang: 'en'
		}
	]}
/>

<article>
	<h1 class="en">concepts</h1>
	<p>Orchestra Canvas Tokyo (OCT) は、2020年8月に発足した音楽団体です。</p>
	<p>
		OCTは、特定の音楽団体を母体に持たない開かれた音楽コミュニティとして設立されました。様々な知識や経験、アイディアを持つ奏者が交流する場となることによって、価値創造の拠点となることを目指しています。
	</p>
	<p>
		設立後は、宇都宮シンフォニーオーケストラ、お茶の水管弦楽団、神奈川大学管弦楽団、九大フィルハーモニー・オーケストラ、京都大学交響楽団、成蹊大学管弦楽団、千葉大学管弦楽団、筑波大学管弦楽団、電気通信大学管弦楽団、東京外国語大学管弦楽団、東京工業大学管弦楽団、東京大学音楽部管弦楽団、東京大学歌劇団、東京大学吹奏楽部、東京大学フィルハーモニー管弦楽団、東京大学フィロムジカ交響楽団、東京農業大学農友会管弦楽部、名古屋市立大学管弦楽団、日本大学管弦楽団、一橋大学交響楽団、法政大学交響楽団、明治大学交響楽団、立教大学交響楽団、ワグネル・ソサィエティー・オーケストラ、早稲田大学交響楽団、Kプレミアムオーケストラ、La
		Jolla Symphony Orchestra、Princeton University
		Orchestraなど多くの団体にルーツを持つ優秀な奏者が多数参加しています。
	</p>
	<p>
		また、強固な運営基盤が整えられていることもOCTの特徴の一つです。団の維持機能を担う総務部、会計業務を担う経理部、演奏活動の広報を担う広報部、演奏活動の企画を担う企画部、演奏会の運営を担う制作部の5つの常設事業部を設け、奏者の持つアイディアに可能な限り挑戦する体制を整えています。
	</p>
	<p>
		これらの環境を最大限活かし、人的・知的交流が支える音楽的挑戦を通じて、皆様に新たな音楽的価値をお届けして参ります。
	</p>

	<img src={organizationChart} alt="組織図" class="img" />
</article>

<style>
	article {
		max-width: 800px;
		line-height: 1.9em;
	}

	h1 {
		font-size: 2.2em;
		margin-bottom: 80px;
	}
	@media (max-width: 950px) {
		h1 {
			font-size: 2em;
		}
	}
	@media (max-width: 950px) {
		h1 {
			font-size: 2em;
		}
	}

	p {
		margin: 30px 0;
		text-indent: 1em;
	}

	.img {
		width: 700px;
		height: auto;
		max-width: 100%;
	}
</style>
