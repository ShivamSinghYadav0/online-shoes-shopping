// Apply stored or system theme before first frame (CSP-safe external script).
try {
  const saved=localStorage.getItem('sd_theme_v7');
  document.documentElement.dataset.theme=['dark','light'].includes(saved)?saved:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
} catch { document.documentElement.dataset.theme='light' }
