const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const srcStatic = path.join(rootDir, '.next', 'static');
const publicDir = path.join(rootDir, 'public');
const legacyPublicNext = path.join(publicDir, '_next');

const standaloneDir = path.join(rootDir, '.next', 'standalone');
const standaloneStatic = path.join(standaloneDir, '.next', 'static');
const standalonePublic = path.join(standaloneDir, 'public');

try {
  // Always remove public/_next to avoid Next.js build conflicts
  if (fs.existsSync(legacyPublicNext)) {
    fs.rmSync(legacyPublicNext, { recursive: true, force: true });
    console.log('[Postbuild] Removed legacy public/_next folder');
  }

  if (fs.existsSync(srcStatic)) {
    // Stage assets inside .next/standalone if standalone build is enabled
    if (fs.existsSync(standaloneDir)) {
      // 1. Copy .next/static -> .next/standalone/.next/static
      fs.mkdirSync(path.dirname(standaloneStatic), { recursive: true });
      fs.cpSync(srcStatic, standaloneStatic, { recursive: true });
      console.log('[Postbuild] Successfully copied .next/static to .next/standalone/.next/static');

      // 2. Copy public -> .next/standalone/public
      if (fs.existsSync(publicDir)) {
        fs.cpSync(publicDir, standalonePublic, { recursive: true });
        console.log('[Postbuild] Successfully copied public to .next/standalone/public');
      }
    }
  } else {
    console.warn('[Postbuild] Warning: .next/static directory not found');
  }
} catch (err) {
  console.error('[Postbuild] Error staging standalone static files:', err);
}
