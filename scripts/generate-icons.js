import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

const PUBLIC_DIR = path.resolve('public');
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

function renderOrbitalIcon(size, isMaskable = false) {
  const png = new PNG({ width: size, height: size });
  const cx = size / 2;
  const cy = size / 2;
  const scale = isMaskable ? 0.72 : 0.88;
  const radius = (size / 2) * scale;

  const a = radius * 0.95; // semi-major
  const b = radius * 0.36; // semi-minor

  const rings = [
    { angle: -Math.PI / 6, r: 56, g: 189, b: 248 }, // Cyan #38bdf8
    { angle: Math.PI / 6, r: 52, g: 211, b: 153 },  // Emerald #34d399
    { angle: Math.PI / 2, r: 168, g: 85, b: 247 },  // Violet #a855f7
  ];

  // Electrons positions along the rings
  const electrons = [
    { ring: 0, t: Math.PI * 0.25, r: 224, g: 242, b: 254 },
    { ring: 1, t: Math.PI * 0.75, r: 209, g: 250, b: 229 },
    { ring: 2, t: Math.PI * 1.5, r: 243, g: 232, b: 255 },
  ];

  const electronPositions = electrons.map((e) => {
    const ring = rings[e.ring];
    const cosA = Math.cos(ring.angle);
    const sinA = Math.sin(ring.angle);
    const ex = a * Math.cos(e.t);
    const ey = b * Math.sin(e.t);
    return {
      x: cx + ex * cosA - ey * sinA,
      y: cy + ex * sinA + ey * cosA,
      r: e.r,
      g: e.g,
      b: e.b,
    };
  });

  const cornerRadius = size * 0.22;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      let insideBg = true;
      let alphaBg = 255;

      if (!isMaskable) {
        const dx = Math.max(0, Math.abs(x - cx) - (size / 2 - cornerRadius));
        const dy = Math.max(0, Math.abs(y - cy) - (size / 2 - cornerRadius));
        const distCorner = Math.hypot(dx, dy);
        if (distCorner > cornerRadius) {
          alphaBg = Math.max(0, Math.min(255, Math.round((cornerRadius + 1 - distCorner) * 255)));
          if (alphaBg <= 0) {
            insideBg = false;
          }
        }
      }

      if (!insideBg) {
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0;
        continue;
      }

      // Background gradient: #0b1120 to #1e1b4b
      const gradT = (x + y) / (size * 2);
      let r = 11 + gradT * (30 - 11);
      let g = 17 + gradT * (27 - 17);
      let b = 32 + gradT * (75 - 32);

      const px = x - cx;
      const py = y - cy;
      const distFromCenter = Math.hypot(px, py);

      // Render 3 Orbital Rings
      rings.forEach((ring) => {
        const cosA = Math.cos(ring.angle);
        const sinA = Math.sin(ring.angle);
        const xr = px * cosA + py * sinA;
        const yr = -px * sinA + py * cosA;

        const dEllipse = Math.abs(Math.hypot(xr / a, yr / b) - 1.0);
        const ringThickness = (size > 64 ? 0.08 : 0.14);

        if (dEllipse < ringThickness * 2.5) {
          const intensity = Math.max(0, 1 - dEllipse / (ringThickness * 2.5));
          const blend = Math.pow(intensity, 1.8) * 0.85;
          r = r * (1 - blend) + ring.r * blend;
          g = g * (1 - blend) + ring.g * blend;
          b = b * (1 - blend) + ring.b * blend;
        }
      });

      // Render Electrons
      electronPositions.forEach((el) => {
        const dEl = Math.hypot(x - el.x, y - el.y);
        const elRadius = Math.max(1.8, size * 0.038);
        if (dEl < elRadius * 2.5) {
          const intensity = Math.max(0, 1 - dEl / (elRadius * 2.5));
          const blend = Math.pow(intensity, 1.5);
          r = r * (1 - blend) + el.r * blend;
          g = g * (1 - blend) + el.g * blend;
          b = b * (1 - blend) + el.b * blend;
        }
      });

      // Central Nucleus with glowing radial falloff
      const coreRadius = Math.max(3, size * 0.12);
      if (distFromCenter < coreRadius * 2.5) {
        const coreIntensity = Math.max(0, 1 - distFromCenter / (coreRadius * 2.5));
        const coreBlend = Math.pow(coreIntensity, 1.6);
        if (distFromCenter < coreRadius * 0.6) {
          // White-hot core
          const whiteBlend = Math.max(0, 1 - distFromCenter / (coreRadius * 0.6));
          r = r * (1 - coreBlend) + (255 * whiteBlend + 56 * (1 - whiteBlend)) * coreBlend;
          g = g * (1 - coreBlend) + (255 * whiteBlend + 189 * (1 - whiteBlend)) * coreBlend;
          b = b * (1 - coreBlend) + (255 * whiteBlend + 248 * (1 - whiteBlend)) * coreBlend;
        } else {
          // Cyan/Blue halo
          r = r * (1 - coreBlend) + 56 * coreBlend;
          g = g * (1 - coreBlend) + 189 * coreBlend;
          b = b * (1 - coreBlend) + 248 * coreBlend;
        }
      }

      png.data[idx] = Math.round(Math.min(255, Math.max(0, r)));
      png.data[idx + 1] = Math.round(Math.min(255, Math.max(0, g)));
      png.data[idx + 2] = Math.round(Math.min(255, Math.max(0, b)));
      png.data[idx + 3] = alphaBg;
    }
  }

  return png;
}

// Full Multi-Platform Icon Matrix
const configs = [
  // Web Standard Favicons
  { file: 'favicon-16x16.png', size: 16, maskable: false },
  { file: 'favicon-32x32.png', size: 32, maskable: false },
  { file: 'favicon-48x48.png', size: 48, maskable: false },

  // Apple iOS Touch Icons
  { file: 'apple-touch-icon.png', size: 180, maskable: false },
  { file: 'apple-touch-icon-152x152.png', size: 152, maskable: false },
  { file: 'apple-touch-icon-167x167.png', size: 167, maskable: false },
  { file: 'apple-touch-icon-180x180.png', size: 180, maskable: false },

  // Android & PWA App Icons
  { file: 'pwa-192x192.png', size: 192, maskable: false },
  { file: 'pwa-512x512.png', size: 512, maskable: false },
  { file: 'pwa-maskable-512x512.png', size: 512, maskable: true },

  // Microsoft Windows Tiles
  { file: 'mstile-150x150.png', size: 150, maskable: false },
];

console.log('Generating complete multi-platform icons for Web, iOS, Android, and Windows...');

for (const cfg of configs) {
  const png = renderOrbitalIcon(cfg.size, cfg.maskable);
  const outPath = path.join(PUBLIC_DIR, cfg.file);
  fs.writeFileSync(outPath, PNG.sync.write(png));
  console.log(`✓ Generated ${cfg.file} (${cfg.size}x${cfg.size})`);
}

// Generate multi-size favicon.ico combining 16x16, 32x32, and 48x48 PNGs
function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(count, 4); // count

  let offset = 6 + count * 16;
  const dirEntries = [];

  for (const { buffer, size } of pngBuffers) {
    const dir = Buffer.alloc(16);
    dir.writeUInt8(size >= 256 ? 0 : size, 0); // width
    dir.writeUInt8(size >= 256 ? 0 : size, 1); // height
    dir.writeUInt8(0, 2); // color palette
    dir.writeUInt8(0, 3); // reserved
    dir.writeUInt16LE(1, 4); // color planes
    dir.writeUInt16LE(32, 6); // bits per pixel
    dir.writeUInt32LE(buffer.length, 8); // size of image in bytes
    dir.writeUInt32LE(offset, 12); // offset of image data
    dirEntries.push(dir);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map((p) => p.buffer)]);
}

const ico16 = PNG.sync.write(renderOrbitalIcon(16, false));
const ico32 = PNG.sync.write(renderOrbitalIcon(32, false));
const ico48 = PNG.sync.write(renderOrbitalIcon(48, false));
const icoBuffer = createIco([
  { buffer: ico16, size: 16 },
  { buffer: ico32, size: 32 },
  { buffer: ico48, size: 48 },
]);
fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
console.log('✓ Generated multi-resolution favicon.ico (16x16, 32x32, 48x48)');

// Generate browserconfig.xml for Windows Start screen and Edge
const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/mstile-150x150.png"/>
      <TileColor>#0b1120</TileColor>
    </tile>
  </msapplication>
</browserconfig>
`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'browserconfig.xml'), browserConfig.trim());
console.log('✓ Generated browserconfig.xml');

// Generate safari-pinned-tab.svg for Safari pinned tabs
const safariPinnedTabSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <g fill="#0ea5e9">
    <!-- Center Nucleus -->
    <circle cx="256" cy="256" r="56" />
    <!-- Elliptical Orbit Rings Outline -->
    <path d="M 256,110 C 370,110 450,175 450,256 C 450,337 370,402 256,402 C 142,402 62,337 62,256 C 62,175 142,110 256,110 Z M 256,128 C 154,128 80,186 80,256 C 80,326 154,384 256,384 C 358,384 432,326 432,256 C 432,186 358,128 256,128 Z" transform="rotate(-30 256 256)" />
    <path d="M 256,110 C 370,110 450,175 450,256 C 450,337 370,402 256,402 C 142,402 62,337 62,256 C 62,175 142,110 256,110 Z M 256,128 C 154,128 80,186 80,256 C 80,326 154,384 256,384 C 358,384 432,326 432,256 C 432,186 358,128 256,128 Z" transform="rotate(30 256 256)" />
    <path d="M 256,110 C 370,110 450,175 450,256 C 450,337 370,402 256,402 C 142,402 62,337 62,256 C 62,175 142,110 256,110 Z M 256,128 C 154,128 80,186 80,256 C 80,326 154,384 256,384 C 358,384 432,326 432,256 C 432,186 358,128 256,128 Z" transform="rotate(90 256 256)" />
    <!-- Electrons -->
    <circle cx="390" cy="180" r="20" />
    <circle cx="122" cy="180" r="20" />
    <circle cx="256" cy="420" r="20" />
  </g>
</svg>
`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'safari-pinned-tab.svg'), safariPinnedTabSvg.trim());
console.log('✓ Generated safari-pinned-tab.svg');
