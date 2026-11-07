(() => {
  const offsets = {
    busuanzi_value_site_uv: 13192,
    busuanzi_value_site_pv: 20632
  };
  const displayed = new WeakMap();

  function applyOffsets() {
    for (const [id, offset] of Object.entries(offsets)) {
      const element = document.getElementById(id);
      if (!element) continue;

      const current = element.textContent.trim();
      if (!current || displayed.get(element) === current) continue;

      const count = Number(current.replace(/,/g, ''));
      if (!Number.isFinite(count)) continue;

      const value = (count + offset).toLocaleString('en-US');
      displayed.set(element, value);
      element.textContent = value;
    }
  }

  new MutationObserver(applyOffsets).observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  applyOffsets();
})();
