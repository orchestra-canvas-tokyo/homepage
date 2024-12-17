<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import hollyWoodLatte from './hollywood-latte.png?enhanced';
	import mizuya from './mizuya.png?enhanced';
	import pdf from './ご支援のお願い.pdf';
</script>

<Meta title="ご支援のお願い" canonical="/support-us" />

<Breadcrumb
	segments={[
		{
			title: 'home',
			lang: 'en',
			url: '/'
		},
		{
			title: 'support us',
			lang: 'en'
		}
	]}
/>

<article>
	<h1>ご支援のお願い</h1>
	<p>平素より、Orchestra Canvas Tokyo へのご厚情を賜りまして、誠にありがとうございます。</p>
	<p>
		当団は、2020 年に発足して以降、定期演奏会や室内楽演奏会を開催し、累計4,000
		名を超えるお客様にご来場をいただきました。また、時間や場所の制約を超えて演奏をお届けしたいとの思いから、演奏会の様子をYouTube
		にて公開し、合計 400,000 回を超える再生回数をいただいております。
	</p>
	<p>
		他方、活動規模の拡大に伴って演奏会開催に要する費用も増加をしており、奏者の負担を原資とする現在の財政においては、活動規模の上限を迎えつつあります。また、財政面を理由とする活動規模の上限は他団体さまも直面をする問題であり、このことがアマチュアオーケストラ界の企画の同質化を招いています。
	</p>
	<p>
		当団は、特定の音楽団体を母体に持たない開かれた音楽コミュニティとして設立され、優秀な奏者と強固な運営基盤を備えております。そして、これらの環境を最大限活かし、人的・知的交流が支える音楽的挑戦を通じて皆様に新たな音楽的価値をお届けすることを、使命と考えています。この、新たな音楽的価値の提供の実現のために、皆様からのご支援をいただけますと幸いです。
	</p>
	<p>今後も意欲的な活動を継続していくために、皆様からのお力添えをお待ちしております。</p>

	<h2>ご支援者さま</h2>

	<div class="supporter-container">
		<div class="fullwidth-supporters">
			<a href="https://hollywoodlatte.com/">
				<enhanced:img
					class="supporter-logo"
					src={hollyWoodLatte}
					alt="MC & Model Agency Hollywood Latte"
				/>
			</a>
			<enhanced:img class="supporter-logo" src={mizuya} alt="MC & Model Agency Hollywood Latte" />
			<a href="http://spacephoto.c.ooco.jp/">(有)スタジオ・スペースフォト</a>
			<a href="https://royal-marriage.shop/">西田ジュエリーデザイン</a>
		</div>
		<div class="halfwidth-supporters-left">
			<span>柿沼　威司　様</span>
			<span>神山　和子　様</span>
			<span>神山　　怜　様</span>
			<span>螺良　修一　様</span>
		</div>
		<div class="halfwidth-supporters-right">
			<span>吉田　裕之　様</span>
			<span>和田　　愛　様</span>
			<span>和田　　究　様</span>
			<span>S. N.　様</span>
		</div>
		<div class="fullwidth-supporters">（他匿名6名様）</div>
	</div>

	<h2>ご寄付のお願い・ご返礼</h2>
	<p>
		ご寄付の際は、<a
			href="https://docs.google.com/forms/d/e/1FAIpQLScyb3TBOqP0PLQFmmm4QO5sEmfTAEcorq9aqe2IEz9ZetBFAQ/viewform"
			>専用フォーム</a
		>より必要情報をお送りください。詳細のご案内を差し上げます。
	</p>
	<p>
		尚、当団ではご支援くださった皆さまに、付表のご返礼・特典をご用意しております。尚、個人の皆様、法人の皆様でご用意の内容が異なりますのでご留意ください。
	</p>
	<p>ご支援のほど、よろしくお願いいたします。</p>

	<details>
		<summary><h3>ご返礼・特典（個人の皆様）</h3></summary>
		<div class="horizontal-scroll">
			<table>
				<thead>
					<tr>
						<th rowspan="3">ご寄付額（円）</th>
						<th colspan="4">返礼・特典</th>
					</tr>
					<tr>
						<th rowspan="2">ご招待<sup>※１</sup></th>
						<th colspan="2">ご芳名掲載<sup>※２</sup></th>
						<th rowspan="2">その他</th>
					</tr>
					<tr>
						<th>当団HP</th>
						<th>プログラム</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>〜2,999</td>
						<td>-</td>
						<td>-</td>
						<td>-</td>
						<td>-</td>
					</tr>
					<tr>
						<td>3,000〜4,999</td>
						<td>2名様</td>
						<td>1年間</td>
						<td>-</td>
						<td>-</td>
					</tr>
					<tr>
						<td>5,000〜6,999</td>
						<td>4名様</td>
						<td>1年間</td>
						<td>-</td>
						<td>-</td>
					</tr>
					<tr>
						<td>7,000〜9,999</td>
						<td>6名様</td>
						<td>1年間</td>
						<td>-</td>
						<td>-</td>
					</tr>
					<tr>
						<td>10,000〜</td>
						<td>6名様</td>
						<td>1年間</td>
						<td>1年間</td>
						<td>その他、ご相談が可能です。</td>
					</tr>
				</tbody>
			</table>
		</div>
	</details>

	<details>
		<summary
			style="cursor: pointer; display: flex; gap: 10px; align-items: center; margin: 40px 0 20px 0;"
		>
			<h3 style="margin: 0;">ご返礼・特典（法人の皆様）</h3>
		</summary>
		<div class="horizontal-scroll">
			<table>
				<thead>
					<tr>
						<th rowspan="3">ご寄付額（円）</th>
						<th colspan="5">返礼・特典</th>
					</tr>
					<tr>
						<th rowspan="2">ご招待<sup>※１</sup></th>
						<th colspan="2">ご芳名掲載<sup>※２</sup></th>
						<th rowspan="2" colspan="2">その他</th>
					</tr>
					<tr>
						<th>当団HP</th>
						<th>プログラム</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>〜2,999</td>
						<td>-</td>
						<td>-</td>
						<td>-</td>
						<td colspan="2">-</td>
					</tr>
					<tr>
						<td>3,000〜4,999</td>
						<td>2名様</td>
						<td>1年間</td>
						<td>-</td>
						<td colspan="2">-</td>
					</tr>
					<tr>
						<td>5,000〜6,999</td>
						<td>4名様</td>
						<td>1年間</td>
						<td>-</td>
						<td colspan="2">-</td>
					</tr>
					<tr>
						<td>7,000〜9,999</td>
						<td>6名様</td>
						<td>1年間</td>
						<td>-</td>
						<td colspan="2">-</td>
					</tr>
					<tr>
						<td>10,000〜29,999</td>
						<td>6名様</td>
						<td>1年間</td>
						<td>1年間</td>
						<td colspan="2">-</td>
					</tr>
					<tr>
						<td rowspan="2">30,000〜49,999</td>
						<td rowspan="2">応相談</td>
						<td rowspan="2">1年間</td>
						<td rowspan="2">1年間</td>
						<td><span style="border-bottom: solid 1px;">協賛</span></td>
						<td>
							１公演をお選びいただき「協賛」としてご支援をいただきます。<br />
							対象公演では、次の返礼をご用意しております。
							<ul>
								<li>各種印刷物<sup>※３</sup>に「協賛：○○」の掲載。</li>
								<li>当団HP演奏会ページにロゴ・リンクの埋込（無期限）。</li>
							</ul>
						</td>
					</tr>
					<tr>
						<td colspan="2">その他、ご相談が可能です。</td>
					</tr>
					<tr>
						<td rowspan="2">50,000〜</td>
						<td rowspan="2">応相談</td>
						<td rowspan="2">1年間</td>
						<td rowspan="2">1年間</td>
						<td><span style="border-bottom: solid 1px;">特別協賛</span></td>
						<td>
							１公演をお選びいただき「特別協賛」としてご支援をいただきます。<br />
							対象公演では、次の返礼をご用意しております。
							<ul>
								<li>各種印刷物<sup>※３</sup>に「特別協賛：○○」の掲載。</li>
								<li>当団HP演奏会ページにロゴ・リンクの埋込（無期限）。</li>
								<li>プログラムにA5版広告の掲載。</li>
							</ul>
						</td>
					</tr>
					<tr>
						<td colspan="2">その他、ご相談が可能です。</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p>
			※１：ご招待は、ご支援より１年間（目安）のうちに開催される有料公演が対象となります。<br />
			※２：ご希望者のみの掲載となります。<br />
			※３：プログラム、ポスター、パンフレットなど。
		</p>
	</details>

	<h2>練習会場のご提供をお願いします</h2>
	<p style="text-indent: 1em;">
		当団では、お持ちの会議室等を練習会場としてお貸しくださる方をお探ししております。
	</p>
	<p style="text-indent: 1em;">
		土日祝日など、ご利用のない日にお貸し出しをいただけますと幸いです。
	</p>
	<p style="text-indent: 1em;">
		ご提供の際は、
		<a
			href="https://docs.google.com/forms/d/e/1FAIpQLSf8VnIPzitpbt-QujtXnqQ4XsiFfxaoIS4cG606euRx9RktAg/viewform"
		>
			専用フォーム
		</a>
		より必要情報をお送りください。担当よりご連絡を差し上げます。
	</p>

	<div class="horizontal-scroll indented">
		<dl class="boxed" style="min-width: 35em">
			<dt>場所</dt>
			<dd>東京23区内またはその近郊</dd>

			<dt>会場条件</dt>
			<dd>
				200㎡以上（250㎡以上を希望）<br />
				奏楽による大きな音が出ます。また、楽器類の搬入が想定されます。
			</dd>

			<dt>使用日</dt>
			<dd>
				土曜・日曜・祝日の４時間程度<br />
				（9:00~13:00、13:00~17:00、17:00~21:00など）<br />
				使用日の約6ヶ月前に、ご予約をしたく存じます。
			</dd>

			<dt>使用料等</dt>
			<dd>
				（目安）使用料25,000円／４時間<br />
				他、ご招待等のご用意につき、ご相談可能です。
			</dd>
		</dl>
	</div>

	<h2>お問い合わせ先</h2>
	<div class="horizontal-scroll">
		<table>
			<tbody>
				<tr>
					<td rowspan="2">ご支援のご提案</td>
					<td>ご寄付のご提案</td>
					<td>
						<a
							href="https://docs.google.com/forms/d/e/1FAIpQLScyb3TBOqP0PLQFmmm4QO5sEmfTAEcorq9aqe2IEz9ZetBFAQ/viewform"
						>
							ご支援　受付フォーム
						</a>
					</td>
				</tr>
				<tr>
					<td>練習会場のご提案</td>
					<td>
						<a
							href="https://docs.google.com/forms/d/e/1FAIpQLSf8VnIPzitpbt-QujtXnqQ4XsiFfxaoIS4cG606euRx9RktAg/viewform"
						>
							練習会場　受付フォーム
						</a>
					</td>
				</tr>
				<tr>
					<td>当リリースの詳細</td>
					<td>パトロネージュ課</td>
					<td>
						<a href="mailto:patronage@orch-canvas.tokyo" class="underlined-link"
							>patronage@orch-canvas.tokyo</a
						>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<p style="margin-top: 40px;">
		<a href={pdf}> 当リリースのPDF版 </a>
	</p>
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

	p {
		margin: 30px 0;
		text-indent: 1em;
	}

	h2 {
		margin-top: 60px;
		font-size: 1.6em;
		font-weight: normal;
	}

	a {
		color: var(--main-color);
	}

	.supporter-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		text-align: center;
		gap: 10px;
	}
	.fullwidth-supporters {
		grid-column: 1 / 3;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 30px;
		margin-bottom: 30px;
	}

	.supporter-logo {
		height: 75px;
		width: auto;
	}

	.halfwidth-supporters-left,
	.halfwidth-supporters-right {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.halfwidth-supporters-left {
		grid-column: 1 / 2;
	}
	.halfwidth-supporters-right {
		grid-column: 2 / 3;
	}

	summary {
		list-style: none;
		cursor: pointer;
		display: flex;
		gap: 10px;
		align-items: center;
		margin: 40px 0 20px 0;
	}
	summary::-webkit-details-marker {
		display: none;
	}

	details summary::before {
		content: '▶';
		font-size: 0.6em;
		transition: 0.1s;
	}
	details[open] summary::before {
		transform: rotate(90deg);
	}

	h3 {
		margin: 0;
		font-size: 1.3em;
		font-weight: normal;
	}

	.horizontal-scroll {
		overflow: auto;
		white-space: nowrap;
	}
	.horizontal-scroll table {
		width: 100%;
	}

	table {
		border-collapse: collapse;
	}
	th,
	td {
		border: 1px solid;
		padding: 5px 15px;
		text-align: center;
		vertical-align: middle;
	}
	table {
		border: 2px solid;
	}
	thead {
		border-bottom: 2px solid;
	}
	thead tr th:first-child,
	thead tr td:first-child {
		border-right: 2px solid;
	}
	table ul {
		margin-bottom: 0;
		text-align: left;
	}

	.boxed {
		border: solid 1px;
		padding: 5px 15px;
	}
</style>
