// VICE CITY DUO — hand-built inline-SVG scenes (no images, no network).
// Two scene builders: boulevardDusk() and pierNight(). Every window, sign,
// palm and reflection is drawn by code below; the two protagonists are
// distinct flat silhouettes with a neon rim-light edge each.

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A grid of windows; lit ones glow warm, the rest stay dark.
function windows(x, y, cols, rows, cw, ch, gx, gy, rand, litColor) {
  let s = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = rand() < 0.42;
      const wx = x + c * (cw + gx);
      const wy = y + r * (ch + gy);
      s += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="${cw}" height="${ch}" fill="${lit ? litColor : '#1a1026'}" opacity="${lit ? (0.55 + rand() * 0.45).toFixed(2) : 0.9}"/>`;
    }
  }
  return s;
}

function palm(x, y, s, lean, flip) {
  const dir = flip ? -1 : 1;
  const fronds = [];
  for (let i = 0; i < 7; i++) {
    const a = (-160 + i * 26) * (Math.PI / 180);
    const len = (58 + (i % 3) * 14) * s;
    const ex = x + Math.cos(a) * len * dir;
    const ey = y - 34 * s + Math.sin(a) * len * 0.55;
    const cx = x + Math.cos(a) * len * 0.55 * dir;
    const cy = y - 34 * s + Math.sin(a) * len * 0.28 - 12 * s;
    fronds.push(`<path d="M ${x} ${y - 34 * s} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#0d0518" stroke-width="${(8 * s).toFixed(1)}" fill="none" stroke-linecap="round"/>`);
  }
  return `<g><path d="M ${x} ${y} Q ${x + lean} ${y - 90 * s} ${x + lean * 1.4} ${y - 150 * s}" stroke="#0d0518" stroke-width="${(7 * s).toFixed(1)}" fill="none" stroke-linecap="round"/>${fronds.join('')}<circle cx="${x + lean * 1.4}" cy="${y - 150 * s}" r="${(6 * s).toFixed(1)}" fill="#0d0518"/></g>`;
}

function neonSign(x, y, text, color, size, vertical, glowId) {
  const t = vertical
    ? text.split('').map((ch, i) => `<text x="${x}" y="${y + i * size * 1.05}" font-size="${size}" fill="${color}" filter="url(#${glowId})" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900">${ch}</text>`).join('')
    : `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" filter="url(#${glowId})" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" letter-spacing="2">${text}</text>`;
  return t;
}

function stars(n, rand, maxY) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = (rand() * 1080).toFixed(1);
    const y = (rand() * maxY).toFixed(1);
    const r = (0.8 + rand() * 1.8).toFixed(1);
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${(0.35 + rand() * 0.6).toFixed(2)}"/>`;
  }
  return s;
}

function birds() {
  const spots = [[180, 210], [235, 185], [820, 160], [880, 205], [700, 120]];
  return spots.map(([x, y]) => `<path d="M ${x} ${y} q 7 -7 14 0 q 7 -7 14 0" stroke="#1c0b2e" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('');
}

// ---- LUCIA: long wavy hair, slim, fitted jacket, hand on hip ----
function luciaSilhouette() {
  return `<g id="duo-lucia" clip-path="url(#clip-lucia)">
    <g fill="#150818">
      <path d="M 455 512 C 430 512 418 532 420 556 C 421 572 428 584 438 590 L 472 590 C 482 584 489 572 490 556 C 492 532 480 512 455 512 Z"/>
      <path d="M 420 540 C 404 566 402 610 412 648 C 418 668 428 676 436 660 C 430 636 430 600 436 574 L 474 574 C 482 600 482 636 474 660 C 482 676 494 668 499 648 C 508 610 506 566 490 540 C 486 524 472 512 455 512 C 438 512 424 524 420 540 Z"/>
      <path d="M 446 588 L 464 588 L 466 606 L 444 606 Z"/>
      <path d="M 424 600 C 412 606 404 622 402 644 L 398 700 C 397 714 408 720 418 712 L 428 664 C 430 640 432 618 438 604 Z"/>
      <path d="M 486 600 C 498 606 506 624 508 646 L 512 706 C 513 720 502 726 492 718 L 482 668 C 480 642 478 618 472 604 Z"/>
      <path d="M 424 596 C 438 590 472 590 486 596 L 492 640 C 494 668 490 692 482 706 L 428 706 C 420 692 416 668 418 640 Z"/>
      <path d="M 430 700 C 424 730 424 762 428 792 L 424 866 L 412 872 L 412 884 L 448 884 L 452 800 C 453 770 454 736 456 708 Z"/>
      <path d="M 480 700 C 486 730 486 764 482 794 L 488 868 L 500 874 L 500 886 L 464 886 L 460 802 C 459 770 458 736 456 708 Z"/>
      <path d="M 412 872 L 448 872 L 450 884 L 410 884 Z"/>
      <path d="M 464 874 L 502 874 L 504 886 L 462 886 Z"/>
    </g>
    <g fill="none" stroke="#ff2e88" stroke-width="3" stroke-linecap="round" class="rim rim-lucia">
      <path d="M 420 540 C 404 566 402 610 412 648"/>
      <path d="M 486 600 C 498 606 506 624 508 646 L 512 706"/>
      <path d="M 480 700 C 486 730 486 764 482 794 L 488 868"/>
    </g>
  </g>`;
}

// ---- JASON: backwards cap, broad shoulders, bomber jacket, arms crossed ----
function jasonSilhouette() {
  return `<g id="duo-jason" clip-path="url(#clip-jason)">
    <g fill="#0a0a16">
      <path d="M 625 514 C 601 514 589 532 591 554 C 592 570 599 582 609 588 L 641 588 C 651 582 658 570 659 554 C 661 532 649 514 625 514 Z"/>
      <path d="M 592 536 C 588 516 604 500 625 500 C 646 500 662 516 658 536 L 640 530 L 610 530 Z"/>
      <path d="M 652 528 L 682 520 L 684 530 L 654 538 Z"/>
      <path d="M 614 586 L 636 586 L 638 604 L 612 604 Z"/>
      <path d="M 588 598 C 572 604 562 620 560 644 L 556 700 C 555 714 566 720 576 712 L 588 660 C 592 636 596 614 602 602 Z"/>
      <path d="M 662 598 C 678 604 688 620 690 644 L 694 700 C 695 714 684 720 674 712 L 662 660 C 658 636 654 614 648 602 Z"/>
      <path d="M 588 594 C 606 588 644 588 662 594 L 672 644 C 676 672 674 694 668 710 L 582 710 C 576 694 574 672 578 644 Z"/>
      <path d="M 596 640 C 612 632 640 632 656 640 L 660 668 C 640 676 610 676 590 668 Z"/>
      <path d="M 588 704 C 580 736 578 768 582 798 L 576 868 L 562 876 L 562 888 L 600 888 L 606 800 C 608 768 610 736 612 706 Z"/>
      <path d="M 662 704 C 670 736 672 768 668 798 L 676 868 L 690 876 L 690 888 L 652 888 L 646 800 C 644 768 642 736 640 706 Z"/>
      <path d="M 560 876 L 602 876 L 604 888 L 558 888 Z"/>
      <path d="M 650 876 L 692 876 L 694 888 L 648 888 Z"/>
    </g>
    <g fill="none" stroke="#22d3ee" stroke-width="3" stroke-linecap="round" class="rim rim-jason">
      <path d="M 662 598 C 678 604 688 620 690 644 L 694 700"/>
      <path d="M 662 704 C 670 736 672 768 668 798 L 676 868"/>
      <path d="M 652 528 L 682 520"/>
    </g>
  </g>`;
}

function titleBlock() {
  return `<g id="title-block" text-anchor="middle">
    <text id="title-tag" x="540" y="806" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="32" letter-spacing="12" fill="#ff5ea8">LEONIDA</text>
    <text id="title-main" x="540" y="856" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="54" letter-spacing="4" fill="#ffffff" stroke="#1c0b2e" stroke-width="2">GRAND THEFT AUTO VI</text>
  </g>`;
}

export function boulevardDusk() {
  const rand = mulberry32(20261119);
  const back = [
    [0, 470, 120, 300], [120, 520, 90, 250], [210, 440, 110, 330], [320, 500, 80, 270],
    [400, 460, 130, 310], [530, 510, 90, 260], [620, 430, 120, 340], [740, 500, 100, 270],
    [840, 450, 110, 320], [950, 510, 130, 260],
  ].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#3a1c5e" opacity="0.85"/>`).join('');
  const front = [
    { x: 30, y: 380, w: 120, h: 420, roof: 'antenna' },
    { x: 160, y: 470, w: 90, h: 330, roof: 'flat' },
    { x: 260, y: 330, w: 110, h: 470, roof: 'stepped' },
    { x: 380, y: 430, w: 100, h: 370, roof: 'tower' },
    { x: 700, y: 400, w: 120, h: 400, roof: 'stepped' },
    { x: 830, y: 470, w: 95, h: 330, roof: 'flat' },
    { x: 935, y: 350, w: 115, h: 450, roof: 'antenna' },
  ].map((b) => {
    let roof = '';
    if (b.roof === 'antenna') roof = `<rect x="${b.x + b.w / 2 - 2}" y="${b.y - 52}" width="4" height="52" fill="#1c0b2e"/><circle cx="${b.x + b.w / 2}" cy="${b.y - 54}" r="5" fill="#ff3355"><animate attributeName="opacity" values="1;0.2;1" dur="1.6s" repeatCount="indefinite"/></circle>`;
    if (b.roof === 'stepped') roof = `<rect x="${b.x + 14}" y="${b.y - 26}" width="${b.w - 28}" height="26" fill="#241040"/><rect x="${b.x + 30}" y="${b.y - 48}" width="${b.w - 60}" height="22" fill="#241040"/>`;
    if (b.roof === 'tower') roof = `<rect x="${b.x + b.w / 2 - 16}" y="${b.y - 40}" width="32" height="40" fill="#241040"/><ellipse cx="${b.x + b.w / 2}" cy="${b.y - 42}" rx="22" ry="8" fill="#2e1550"/>`;
    const win = windows(b.x + 12, b.y + 22, Math.max(2, Math.floor((b.w - 24) / 22)), Math.max(3, Math.floor((b.h - 40) / 30)), 12, 16, 10, 14, rand, '#ffd166');
    return `<g><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="#241040"/>${roof}${win}</g>`;
  }).join('');
  return `
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" class="sky-top"/><stop offset="0.45" class="sky-mid"/><stop offset="0.78" class="sky-low"/><stop offset="1" class="sky-hor"/>
    </linearGradient>
    <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffe9a8" stop-opacity="0.95"/><stop offset="0.55" stop-color="#ff9e57" stop-opacity="0.55"/><stop offset="1" stop-color="#ff5e7a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="streetGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a123f"/><stop offset="1" stop-color="#12081f"/>
    </linearGradient>
    <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff6c9" stop-opacity="0.9"/><stop offset="1" stop-color="#fff6c9" stop-opacity="0"/>
    </linearGradient>
    <filter id="glowPink" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glowCyan" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glowGold" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10"/></filter>
    <clipPath id="clip-lucia"><polygon id="clip-lucia-poly" points="0,0 540,0 540,1080 0,1080"/></clipPath>
    <clipPath id="clip-jason"><polygon id="clip-jason-poly" points="540,0 1080,0 1080,1080 540,1080"/></clipPath>
  </defs>
  <rect x="0" y="0" width="1080" height="1080" fill="url(#skyGrad)"/>
  ${stars(70, rand, 380)}
  <circle cx="590" cy="440" r="180" fill="url(#sunGlow)"/>
  <circle cx="590" cy="440" r="85" fill="#ffe9a8" opacity="0.95"/>
  <circle cx="590" cy="440" r="64" fill="#ffd166"/>
  ${birds()}
  <g>${back}</g>
  <g>${front}</g>
  ${neonSign(315, 420, 'OCEAN DRIVE', '#ff5ea8', 30, true, 'glowPink')}
  ${neonSign(430, 470, 'HOTEL VICE', '#22d3ee', 26, false, 'glowCyan')}
  ${neonSign(760, 440, 'NEON', '#ffd166', 34, false, 'glowGold')}
  ${neonSign(992, 420, 'PALMS', '#ff5ea8', 26, true, 'glowPink')}
  ${neonSign(205, 560, 'BAR', '#22d3ee', 24, false, 'glowCyan')}
  ${neonSign(880, 560, 'CASINO', '#ffd166', 24, false, 'glowGold')}
  <rect x="0" y="800" width="1080" height="280" fill="url(#streetGrad)"/>
  <g filter="url(#soft)" opacity="0.55">
    <rect x="270" y="810" width="90" height="240" fill="#ff5ea8" opacity="0.35"/>
    <rect x="700" y="810" width="110" height="240" fill="#ffd166" opacity="0.3"/>
    <rect x="380" y="810" width="120" height="240" fill="#ff9e57" opacity="0.4"/>
    <rect x="880" y="810" width="70" height="240" fill="#22d3ee" opacity="0.3"/>
  </g>
  <g stroke="#f5e9ff" stroke-width="6" stroke-dasharray="34 26" opacity="0.7"><line x1="0" y1="880" x2="1080" y2="880"/></g>
  <g id="car">
    <path d="M 600 838 C 640 806 700 792 760 792 C 830 792 880 806 910 828 L 922 846 L 600 846 Z" fill="#1a0b28"/>
    <path d="M 620 838 L 640 812 L 720 806 L 700 838 Z" fill="#7dd3fc" opacity="0.85"/>
    <path d="M 730 806 L 800 806 L 830 836 L 730 838 Z" fill="#7dd3fc" opacity="0.7"/>
    <circle cx="660" cy="846" r="22" fill="#0d0518"/><circle cx="660" cy="846" r="10" fill="#cbd5e1"/>
    <circle cx="860" cy="846" r="22" fill="#0d0518"/><circle cx="860" cy="846" r="10" fill="#cbd5e1"/>
    <polygon points="912,826 1080,812 1080,852 912,842" fill="url(#beamGrad)" opacity="0.85"/>
    <circle cx="914" cy="830" r="7" fill="#fff6c9" filter="url(#glowGold)"/>
  </g>
  <g id="palms-back">${palm(60, 806, 1.1, -14, false)}${palm(1020, 806, 1.25, 16, true)}${palm(180, 806, 0.85, -10, false)}</g>
  <rect id="tint-lucia" x="0" y="0" width="1080" height="1080" fill="#ff5ea8" opacity="0.07" clip-path="url(#clip-lucia)"/>
  <rect id="tint-jason" x="0" y="0" width="1080" height="1080" fill="#22d3ee" opacity="0.07" clip-path="url(#clip-jason)"/>
  ${luciaSilhouette()}
  ${jasonSilhouette()}
  <g id="palms-front">${palm(985, 900, 1.5, 20, true)}${palm(95, 900, 1.35, -18, false)}</g>
  <g id="split-line"><line id="split-line-el" x1="540" y1="0" x2="540" y2="1080" stroke="#ffffff" stroke-width="4" opacity="0.9"/><line x1="540" y1="0" x2="540" y2="1080" stroke="#ff2e88" stroke-width="10" opacity="0.35"/></g>
  ${titleBlock()}`;
}

export function pierNight() {
  const rand = mulberry32(777001);
  const wheelCabins = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const cx = 830 + Math.cos(a) * 95;
    const cy = 430 + Math.sin(a) * 95;
    const col = ['#ff5ea8', '#22d3ee', '#ffd166'][i % 3];
    wheelCabins.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="9" fill="${col}" filter="url(#glowPink)"/>`);
  }
  const lampPosts = [120, 330, 540, 750, 960].map((x) => `<g><rect x="${x - 3}" y="640" width="6" height="130" fill="#0d0518"/><circle cx="${x}" cy="636" r="10" fill="#ffe9a8" filter="url(#glowGold)"/><ellipse cx="${x}" cy="782" rx="34" ry="8" fill="#ffd166" opacity="0.25"/></g>`).join('');
  const waves = [830, 860, 892, 926, 962].map((y, i) => `<path d="M 0 ${y} Q 135 ${y - 8} 270 ${y} T 540 ${y} T 810 ${y} T 1080 ${y}" stroke="#22d3ee" stroke-width="2.5" fill="none" opacity="${(0.35 - i * 0.05).toFixed(2)}"/>`).join('');
  return `
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" class="sky-top"/><stop offset="0.5" class="sky-mid"/><stop offset="0.8" class="sky-low"/><stop offset="1" class="sky-hor"/>
    </linearGradient>
    <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#e8f4ff" stop-opacity="0.9"/><stop offset="0.6" stop-color="#9db8dd" stop-opacity="0.35"/><stop offset="1" stop-color="#9db8dd" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="streetGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0b1e3a"/><stop offset="1" stop-color="#050914"/>
    </linearGradient>
    <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff6c9" stop-opacity="0.9"/><stop offset="1" stop-color="#fff6c9" stop-opacity="0"/>
    </linearGradient>
    <filter id="glowPink" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glowCyan" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glowGold" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10"/></filter>
    <clipPath id="clip-lucia"><polygon id="clip-lucia-poly" points="0,0 540,0 540,1080 0,1080"/></clipPath>
    <clipPath id="clip-jason"><polygon id="clip-jason-poly" points="540,0 1080,0 1080,1080 540,1080"/></clipPath>
  </defs>
  <rect x="0" y="0" width="1080" height="1080" fill="url(#skyGrad)"/>
  ${stars(110, rand, 420)}
  <circle cx="220" cy="180" r="120" fill="url(#sunGlow)"/>
  <circle cx="220" cy="180" r="62" fill="#f2f7ff" opacity="0.95"/>
  <circle cx="200" cy="165" r="12" fill="#c9d8ee" opacity="0.8"/><circle cx="238" cy="196" r="8" fill="#c9d8ee" opacity="0.7"/>
  ${birds()}
  <g stroke="#0d0518" stroke-width="5" fill="none" opacity="0.95">
    <circle cx="830" cy="430" r="95"/><circle cx="830" cy="430" r="60"/>
    <line x1="830" y1="335" x2="830" y2="525"/><line x1="735" y1="430" x2="925" y2="430"/>
    <line x1="763" y1="363" x2="897" y2="497"/><line x1="897" y1="363" x2="763" y2="497"/>
  </g>
  ${wheelCabins.join('')}
  <rect x="790" y="520" width="80" height="180" fill="#0d0518"/>
  <g><rect x="0" y="700" width="1080" height="380" fill="url(#streetGrad)"/>${waves}</g>
  <g><polygon points="0,700 1080,700 1080,780 0,780" fill="#1a2c4a"/><polygon points="0,780 1080,780 1080,800 0,800" fill="#0d0518"/></g>
  ${lampPosts}
  <g filter="url(#soft)" opacity="0.5">
    <ellipse cx="830" cy="760" rx="150" ry="26" fill="#ff5ea8" opacity="0.35"/>
    <ellipse cx="220" cy="760" rx="120" ry="22" fill="#9db8dd" opacity="0.35"/>
  </g>
  ${neonSign(830, 330, 'PIER 69', '#ff5ea8', 30, false, 'glowPink')}
  ${neonSign(120, 620, 'VICE', '#22d3ee', 30, false, 'glowCyan')}
  <g id="palms-back">${palm(60, 706, 1.0, -12, false)}${palm(1020, 706, 1.1, 14, true)}</g>
  <rect id="tint-lucia" x="0" y="0" width="1080" height="1080" fill="#ff5ea8" opacity="0.07" clip-path="url(#clip-lucia)"/>
  <rect id="tint-jason" x="0" y="0" width="1080" height="1080" fill="#22d3ee" opacity="0.07" clip-path="url(#clip-jason)"/>
  ${luciaSilhouette()}
  ${jasonSilhouette()}
  <g id="palms-front">${palm(985, 800, 1.4, 18, true)}${palm(95, 800, 1.25, -16, false)}</g>
  <g id="split-line"><line id="split-line-el" x1="540" y1="0" x2="540" y2="1080" stroke="#ffffff" stroke-width="4" opacity="0.9"/><line x1="540" y1="0" x2="540" y2="1080" stroke="#ff2e88" stroke-width="10" opacity="0.35"/></g>
  ${titleBlock()}`;
}

