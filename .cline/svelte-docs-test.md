# Svelteの特性に合わせたテスト方法

このドキュメントでは、Svelteの特性に合わせたテスト方法について説明します。

## 1. Svelteコンポーネントのレンダリングテスト

### コンポーネントのマウント

```typescript
// Svelteコンポーネントをレンダリングする
const { container, component } = render(MyComponent, {
	props: {
		// コンポーネントのプロパティ
		name: 'Test',
		value: 123
	}
});
```

### 重要なポイント

- `render`関数は`container`と`component`を返す
- `container`はDOMノードで、クエリセレクタを使用して要素を検索できる
- `component`はSvelteコンポーネントのインスタンスで、内部状態にアクセスできる

### 例：Svelteコンポーネントのレンダリングテスト

```typescript
it('[pos] コンポーネントが正しくレンダリングされる', () => {
	// 仕様: コンポーネントは与えられたプロパティに基づいて正しくレンダリングされる
	const { container } = render(Breadcrumb, {
		props: {
			segments: [{ title: 'ホーム', lang: 'ja' }]
		}
	});

	// コンテナからDOM要素を検索
	const nav = container.querySelector('nav');
	expect(nav).not.toBeNull();

	const span = container.querySelector('span');
	expect(span).not.toBeNull();
	expect(span?.textContent).toBe('ホーム');
});
```

## 2. Svelteの反応性（リアクティビティ）のテスト

Svelteの大きな特徴の一つは、反応性システムです。プロパティや状態が変更されたときのコンポーネントの振る舞いをテストする必要があります。

### プロパティの更新テスト

```typescript
it('[pos] プロパティが更新されると表示も更新される', async () => {
	// 仕様: プロパティが更新されると、コンポーネントの表示も更新される
	const { component, container } = render(Counter, {
		props: { count: 0 }
	});

	// 初期状態を確認
	expect(container.textContent).toContain('0');

	// プロパティを更新
	await component.$set({ count: 5 });

	// 更新後の状態を確認
	expect(container.textContent).toContain('5');
});
```

### 内部状態の更新テスト

```typescript
it('[pos] 内部状態が更新されると表示も更新される', async () => {
	// 仕様: 内部状態が更新されると、コンポーネントの表示も更新される
	const { component, container } = render(Counter);

	// 初期状態を確認
	expect(container.textContent).toContain('0');

	// イベントをトリガーして内部状態を更新
	const button = container.querySelector('button');
	await fireEvent.click(button);

	// 更新後の状態を確認
	expect(container.textContent).toContain('1');
});
```

## 3. Svelteのライフサイクルメソッドのテスト

Svelteコンポーネントには、`onMount`、`onDestroy`などのライフサイクルメソッドがあります。これらの動作をテストすることも重要です。

### onMountのテスト

```typescript
it('[pos] onMountでデータが取得される', async () => {
	// 仕様: コンポーネントがマウントされると、データが取得される
	// APIモックを設定
	vi.spyOn(global, 'fetch').mockResolvedValue({
		json: vi.fn().mockResolvedValue({ data: 'test' })
	} as any);

	const { container } = render(DataFetcher);

	// 非同期処理を待機
	await vi.waitFor(() => {
		expect(container.textContent).toContain('test');
	});

	// モックがコンポーネントのマウント時に呼ばれたことを確認
	expect(global.fetch).toHaveBeenCalledTimes(1);
});
```

### onDestroyのテスト

```typescript
it('[pos] onDestroyでリソースがクリーンアップされる', async () => {
	// 仕様: コンポーネントが破棄されると、リソースがクリーンアップされる
	const cleanupMock = vi.fn();

	// クリーンアップ関数をモック
	vi.spyOn(window, 'addEventListener').mockImplementation(() => {});
	vi.spyOn(window, 'removeEventListener').mockImplementation(cleanupMock);

	const { component } = render(EventListener);

	// コンポーネントを破棄
	component.$destroy();

	// クリーンアップ関数が呼ばれたことを確認
	expect(cleanupMock).toHaveBeenCalled();
});
```

## 4. Svelteのイベント処理のテスト

Svelteコンポーネントは、DOMイベントとカスタムイベントの両方を処理できます。これらのイベント処理をテストすることも重要です。

### DOMイベントのテスト

```typescript
it('[pos] ボタンクリックでカウントが増加する', async () => {
	// 仕様: ボタンをクリックすると、カウントが1増加する
	const { container } = render(Counter);

	// 初期状態を確認
	expect(container.textContent).toContain('0');

	// ボタンをクリック
	const button = container.querySelector('button');
	await fireEvent.click(button);

	// 更新後の状態を確認
	expect(container.textContent).toContain('1');
});
```

### カスタムイベントのテスト

```typescript
it('[pos] カスタムイベントが発火される', () => {
	// 仕様: 特定の操作を行うと、カスタムイベントが発火される
	const mockHandler = vi.fn();

	const { container, component } = render(EventEmitter);

	// イベントリスナーを追加
	component.$on('custom-event', mockHandler);

	// イベントをトリガー
	const button = container.querySelector('button');
	fireEvent.click(button);

	// イベントハンドラが呼ばれたことを確認
	expect(mockHandler).toHaveBeenCalled();
	// イベントデータを確認
	expect(mockHandler.mock.calls[0][0].detail).toEqual({ value: 'test' });
});
```

## 5. Svelteのスロットとコンテキストのテスト

Svelteはスロットとコンテキストを使用してコンポーネント間で情報を共有できます。これらの機能をテストすることも重要です。

### スロットのテスト

```typescript
it('[pos] スロットコンテンツが正しく表示される', () => {
	// 仕様: スロットに渡されたコンテンツが正しく表示される
	const { container } = render(SlotContainer, {
		props: {},
		slots: {
			default: '<p>Default slot content</p>',
			named: '<span>Named slot content</span>'
		}
	});

	// デフォルトスロットのコンテンツを確認
	expect(container.querySelector('p').textContent).toBe('Default slot content');

	// 名前付きスロットのコンテンツを確認
	expect(container.querySelector('.named-slot span').textContent).toBe('Named slot content');
});
```

### コンテキストのテスト

```typescript
it('[pos] コンテキストが子コンポーネントに正しく渡される', () => {
	// 仕様: 親コンポーネントから提供されたコンテキストが子コンポーネントで利用できる
	// コンテキストを使用する子コンポーネントをモック
	const ChildComponent = {
		render: vi.fn()
	};

	// 親コンポーネントをレンダリング
	render(ContextProvider, {
		props: {
			value: 'test',
			child: ChildComponent
		}
	});

	// 子コンポーネントのレンダリング関数が正しいコンテキストで呼ばれたことを確認
	expect(ChildComponent.render).toHaveBeenCalledWith(
		expect.objectContaining({
			context: expect.objectContaining({
				'context-key': 'test'
			})
		})
	);
});
```

## 6. SvelteKitの特有機能のテスト

SvelteKitを使用している場合、ルーティング、ロード関数、アクションなどの特有機能をテストする必要があります。

### ページロード関数のテスト

```typescript
it('[pos] ロード関数が正しいデータを返す', async () => {
	// 仕様: ロード関数は必要なデータを取得して返す
	// APIモックを設定
	vi.spyOn(global, 'fetch').mockResolvedValue({
		json: vi.fn().mockResolvedValue({ data: 'test' })
	} as any);

	// ロード関数を実行
	const result = await load({ params: { id: '123' } });

	// 結果を確認
	expect(result).toEqual({
		props: {
			data: 'test'
		}
	});

	// APIが正しいパラメータで呼ばれたことを確認
	expect(global.fetch).toHaveBeenCalledWith('/api/data/123');
});
```

### フォームアクションのテスト

```typescript
it('[pos] フォームアクションが正しく処理される', async () => {
	// 仕様: フォームアクションはデータを処理して結果を返す
	// APIモックを設定
	vi.spyOn(global, 'fetch').mockResolvedValue({
		json: vi.fn().mockResolvedValue({ success: true })
	} as any);

	// アクション関数を実行
	const result = await actions.default({
		request: new Request('http://localhost', {
			method: 'POST',
			body: new FormData()
		})
	});

	// 結果を確認
	expect(result).toEqual({
		success: true
	});
});
```

## 7. Svelteテストの特有の注意点

### コンポーネントのライフサイクル

Svelteコンポーネントは、レンダリング、更新、破棄のライフサイクルを持ちます。テストでは、これらのライフサイクルを適切に処理する必要があります。

```typescript
// テスト後にコンポーネントをクリーンアップ
afterEach(() => {
	// コンポーネントを破棄
	component.$destroy();
});
```

### 非同期更新の処理

Svelteの状態更新は非同期に行われることがあります。テストでは、これらの非同期更新を適切に処理する必要があります。

```typescript
// 非同期更新を待機
await tick();
```

### スタイルのテスト

Svelteはコンポーネントにスコープ付きCSSを提供します。スタイルのテストも重要です。

```typescript
it('[pos] コンポーネントに正しいスタイルが適用される', () => {
	// 仕様: コンポーネントには特定のスタイルが適用される
	const { container } = render(StyledComponent);

	// スタイルを確認
	const element = container.querySelector('.styled');
	const styles = window.getComputedStyle(element);

	expect(styles.color).toBe('rgb(255, 0, 0)'); // 赤色
	expect(styles.fontSize).toBe('16px');
});
```

## 参考資料

以下の資料を参考にしています：

1. Svelte公式ドキュメント: [Testing](https://svelte.dev/docs/testing)
2. SvelteKit公式ドキュメント: [Testing](https://kit.svelte.dev/docs/testing)
3. Vitest公式ドキュメント: [Testing Svelte](https://vitest.dev/guide/svelte.html)
4. svelte-testing-library: [Documentation](https://testing-library.com/docs/svelte-testing-library/intro/)
5. Svelte Society: [Testing Recipes](https://sveltesociety.dev/recipes/testing-and-debugging/unit-testing-svelte-components/)
