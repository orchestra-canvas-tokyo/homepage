<script lang="ts">
	import organizationStats from '$lib/organizationStats.json';
	import {
		formatAttendanceCount,
		formatYouTubeSubscriberCount,
		formatYouTubeTotalViewCount
	} from '$lib/organizationStats';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import organizationChart from './organization-chart.png';

	const displayingTotalAttendance = formatAttendanceCount(organizationStats.totalAttendance);
	const displayingYouTubeSubscriberCount = formatYouTubeSubscriberCount(
		organizationStats.youtubeSubscriberCount
	);
	const displayingYouTubeTotalViewCount = formatYouTubeTotalViewCount(
		organizationStats.youtubeTotalViewCount
	);
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
		OCTは、特定の音楽団体を母体に持たない開かれた音楽コミュニティとして設立されました。団体名である"Canvas(
		画布
		)"という単語には、さまざまな知識・経験が出会い、一つの作品を織りなす場となることを目指す、当団設立の理念が込められています。
	</p>
	<p>
		設立後は、定期演奏会・室内楽演奏会を中心とする演奏活動を重ね、累計{displayingTotalAttendance}を超えるお客様をお迎えするとともに、YouTubeを通じた動画配信ではチャンネル登録者数{displayingYouTubeSubscriberCount}、総再生回数{displayingYouTubeTotalViewCount}を達成するなど、時間や場所の制約を超えた音楽活動を目指しています。
	</p>
	<p>
		また、強固な運営基盤が整えられていることもOCTの特徴の一つです。団の維持機能を担う総務部・経理部、広報機能を担う広報部、制作機能を担う企画部・制作部の5つの常設組織を設け、奏者の持つアイディアに可能な限り挑戦する体制を整えています。
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
