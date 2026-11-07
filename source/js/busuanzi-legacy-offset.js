(() => {
  const offsets = {
    busuanzi_value_site_uv: 13216,
    busuanzi_value_site_pv: 20656
  };
  const pageOffsets = {
    '/posts/weclone-linux-tutorial/': 3695,
    '/2025/05/14/WeClone-用微信聊天记录打造自己的AI数字分身/': 9139,
    '/posts/25120721/': 556,
    '/posts/25083022/': 35,
    '/2025/04/19/我的第一篇博客/': 173,
    '/posts/26101601/': 10,
    '/posts/26101401/': 7,
    '/posts/25100720/': 42,
    '/posts/25102520/': 73
  };
  const displayed = new WeakMap();

  function applyOffset(element, offset) {
    if (!element || !offset) return;

    const current = element.textContent.trim();
    if (!current || displayed.get(element) === current) return;

    const count = Number(current.replace(/,/g, ''));
    if (!Number.isFinite(count)) return;

    const value = (count + offset).toLocaleString('en-US');
    displayed.set(element, value);
    element.textContent = value;
  }

  function applyOffsets() {
    for (const [id, offset] of Object.entries(offsets)) {
      applyOffset(document.getElementById(id), offset);
    }

    let path = window.location.pathname;
    try {
      path = decodeURIComponent(path);
    } catch {}
    applyOffset(
      document.getElementById('busuanzi_value_page_pv'),
      pageOffsets[path]
    );
  }

  new MutationObserver(applyOffsets).observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  applyOffsets();
})();
