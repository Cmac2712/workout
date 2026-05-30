// Native-only stub for react-dom. See metro.config.js resolveRequest.
// react-aria reaches for these even from RN-targeted code paths, but the
// runtime gates them on `typeof window !== 'undefined'`, so they should
// never execute on native. The exports exist only to satisfy the bundler.

const flushSync = (fn) => (typeof fn === "function" ? fn() : undefined);
const createPortal = (children) => children;

const stub = { flushSync, createPortal };

module.exports = {
  __esModule: true,
  default: stub,
  flushSync,
  createPortal,
};
