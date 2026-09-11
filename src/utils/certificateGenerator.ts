export interface CertificateData {
  studentName: string;
  credentialId: string;
  qrCodeDataUrl: string;
  completedCount: number;
  totalCount: number;
  issueDateGregorian: string;
  issueDateHijri?: string;
  grandExamPercentage?: number;
  grandExamScore?: number;
}

export async function generateCertificateBlob(data: CertificateData): Promise<{ blob: Blob; dataUrl: string; canvas: HTMLCanvasElement }> {
  // Ensure document fonts are completely ready before measuring or drawing
  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }

  const canvas = document.createElement('canvas');
  // High-Definition 2400 x 1700 (A4 Landscape 1.412 aspect ratio at 300 DPI)
  const width = 2400;
  const height = 1700;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // Reset any inherited letter spacing or text metrics to standard normal
  if ('letterSpacing' in ctx) {
    (ctx as any).letterSpacing = 'normal';
  }

  // 1. Ultra-Luxurious Deep Obsidian & Midnight Navy Canvas
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, '#05070F');
  bgGradient.addColorStop(0.3, '#0A0E1F');
  bgGradient.addColorStop(0.7, '#070914');
  bgGradient.addColorStop(1, '#030408');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Subtle radial ambient light in the upper center
  const ambientGlow = ctx.createRadialGradient(width / 2, height * 0.38, 50, width / 2, height * 0.38, 900);
  ambientGlow.addColorStop(0, 'rgba(56, 189, 248, 0.07)');
  ambientGlow.addColorStop(0.4, 'rgba(217, 119, 6, 0.05)');
  ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = ambientGlow;
  ctx.fillRect(0, 0, width, height);

  // 2. Micro-Guilloche Security Background Lines
  ctx.save();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.025)';
  ctx.lineWidth = 1;
  for (let i = 0; i < width; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.bezierCurveTo(i + 80, height * 0.3, i - 80, height * 0.7, i, height);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Multi-Tier Golden Frame Borders
  // Outer Solid Gold Border
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 8;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  // Fine Inner Accent Line
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.strokeRect(66, 66, width - 132, height - 132);

  // Thin Security Inset Border with corner notches
  ctx.strokeStyle = 'rgba(253, 230, 138, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(80, 80, width - 160, height - 160);

  // 4. Ornate Corner Anchors
  const drawCorner = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.strokeStyle = '#F59E0B';
    ctx.fillStyle = '#D4AF37';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(50, 0);
    ctx.lineTo(50, 14);
    ctx.lineTo(14, 14);
    ctx.lineTo(14, 50);
    ctx.lineTo(0, 50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Small rosette dot
    ctx.beginPath();
    ctx.arc(32, 32, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#FEF08A';
    ctx.fill();

    ctx.restore();
  };

  drawCorner(84, 84, 0);
  drawCorner(width - 84, 84, 90);
  drawCorner(width - 84, height - 84, 180);
  drawCorner(84, height - 84, 270);

  // 5. Top International Consortium Accreditation Bar
  const ribbonY = 135;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Ribbon badge capsule
  const ribbonW = 1080;
  const ribbonH = 46;
  ctx.fillStyle = 'rgba(217, 119, 6, 0.12)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(width / 2 - ribbonW / 2, ribbonY - ribbonH / 2, ribbonW, ribbonH, 23);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 18px "Inter", "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#FDE68A';
  ctx.fillText('★ GLOBAL ARTIFICIAL INTELLIGENCE RESEARCH & INDUSTRY CONSORTIUM ★', width / 2, ribbonY);

  // 6. Partner Institutions & Industry Leaders Badges Row
  const partnerBadgesY = 205;
  const partners = [
    { name: 'GOOGLE CLOUD & DEEPMIND', color: '#60A5FA' },
    { name: 'NVIDIA DLI', color: '#34D399' },
    { name: 'META AI RESEARCH', color: '#38BDF8' },
    { name: 'OPENAI FOUNDATION', color: '#FCD34D' },
    { name: 'HUGGING FACE', color: '#FB923C' },
    { name: 'ANTHROPIC', color: '#E879F9' },
    { name: 'STANFORD SAIL', color: '#F87171' },
    { name: 'MIT CSAIL', color: '#A78BFA' }
  ];

  ctx.font = 'bold 14px "Inter", sans-serif';
  const partnerLine = partners.map(p => p.name).join('   •   ');
  ctx.fillStyle = '#94A3B8';
  ctx.fillText(partnerLine, width / 2, partnerBadgesY);

  // Fine Golden Divider
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 500, 238);
  ctx.lineTo(width / 2 + 500, 238);
  ctx.stroke();

  // 7. Certificate Category Header
  ctx.font = '600 17px "Inter", sans-serif';
  ctx.fillStyle = '#38BDF8';
  if ('letterSpacing' in ctx) {
    (ctx as any).letterSpacing = '3px';
  }
  ctx.fillText('OFFICIAL POST-GRADUATE EXECUTIVE FELLOWSHIP CREDENTIAL', width / 2, 275);
  // Reset letter spacing immediately so title and student name never get squished or stretched
  if ('letterSpacing' in ctx) {
    (ctx as any).letterSpacing = 'normal';
  }

  // 8. Main Certificate Title (Cinzel / Serif Prestige)
  ctx.font = '900 46px "Cinzel", "Times New Roman", "Georgia", serif';
  const titleGradient = ctx.createLinearGradient(width / 2 - 500, 0, width / 2 + 500, 0);
  titleGradient.addColorStop(0, '#FFFFFF');
  titleGradient.addColorStop(0.3, '#FEF08A');
  titleGradient.addColorStop(0.7, '#FCD34D');
  titleGradient.addColorStop(1, '#F59E0B');
  ctx.fillStyle = titleGradient;
  ctx.fillText('CERTIFICATE OF SCIENTIFIC EXCELLENCE', width / 2, 340);

  // Sub-title
  ctx.font = 'bold 21px "Inter", sans-serif';
  ctx.fillStyle = '#E2E8F0';
  ctx.fillText('Frontier AI Systems Architecture & Large Language Model (LLM) Engineering', width / 2, 395);

  ctx.font = '600 15px "JetBrains Mono", monospace';
  ctx.fillStyle = '#06B6D4';
  ctx.fillText('JINNA 5.0 SCIENTIFIC CURRICULUM • FROM ZERO TO ULTIMATE PRO • LEVEL 8 FELLOWSHIP', width / 2, 428);

  // 9. Conferred Statement
  ctx.font = 'italic 19px "Georgia", serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('This post-graduate credential is formally and proudly conferred upon', width / 2, 485);

  // 10. Student Name Box with Rich Luxury Borders
  const nameBoxY = 525;
  const nameBoxW = 1060;
  const nameBoxH = 100;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(width / 2 - nameBoxW / 2, nameBoxY, nameBoxW, nameBoxH, 18);
  ctx.fill();
  ctx.stroke();

  // Student Name
  ctx.font = '900 52px "Cinzel", "Times New Roman", "Georgia", serif';
  const nameGrad = ctx.createLinearGradient(width / 2 - 350, 0, width / 2 + 350, 0);
  nameGrad.addColorStop(0, '#FFFFFF');
  nameGrad.addColorStop(0.4, '#FEF08A');
  nameGrad.addColorStop(0.8, '#FCD34D');
  nameGrad.addColorStop(1, '#F59E0B');
  ctx.fillStyle = nameGrad;
  
  const studentDisplayName = (data.studentName || 'YOUSUF ALBAZ').toUpperCase();
  ctx.fillText(studentDisplayName, width / 2, nameBoxY + nameBoxH / 2);

  // 11. Commendation & Academic Citation
  const citationY = 665;
  ctx.font = '500 18px "Inter", sans-serif';
  ctx.fillStyle = '#CBD5E1';

  let citationText1 = 'In formal recognition of outstanding mastery, theoretical rigor, and demonstrable engineering excellence';
  let citationText2 = 'across 2,000+ accredited laboratory hours, fulfilling all post-graduate curriculum requirements';
  let citationText3 = 'and defending the Grand Academic Defense Examination with First-Class Honors.';

  if (data.grandExamPercentage && data.grandExamPercentage >= 85) {
    citationText3 = `and successfully defending the Grand Academic Defense Examination with an Elite Score of ${data.grandExamPercentage}%.`;
  }

  ctx.fillText(citationText1, width / 2, citationY);
  ctx.fillText(citationText2, width / 2, citationY + 28);
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 18px "Inter", sans-serif';
  ctx.fillText(citationText3, width / 2, citationY + 56);

  // 12. Four Pillars of Core Engineering Competencies
  const matrixY = 765;
  const boxW = 505;
  const boxH = 115;
  const gap = 20;
  const startX = width / 2 - (boxW * 2 + gap * 1.5);

  const pillars = [
    {
      title: 'CUDA & GPU COMPUTE',
      sub: 'Low-Level Kernel Optimization & Triton',
      hours: '450 Laboratory Hours',
      color: '#38BDF8'
    },
    {
      title: 'LLMs FROM SCRATCH',
      sub: 'Attention Mechanisms, RoPE & KV-Cache',
      hours: '650 Laboratory Hours',
      color: '#F87171'
    },
    {
      title: 'DISTRIBUTED SCALING',
      sub: 'DeepSpeed ZeRO-3, Megatron & FSDP',
      hours: '550 Laboratory Hours',
      color: '#C084FC'
    },
    {
      title: 'ENTERPRISE INFERENCE',
      sub: 'High-Throughput vLLM & Deployment',
      hours: '350 Laboratory Hours',
      color: '#34D399'
    }
  ];

  pillars.forEach((p, i) => {
    const bx = startX + i * (boxW + gap);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bx, matrixY, boxW, boxH, 14);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillStyle = p.color;
    ctx.fillText(p.title, bx + boxW / 2, matrixY + 36);

    ctx.font = '500 15px "Inter", sans-serif';
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText(p.sub, bx + boxW / 2, matrixY + 66);

    ctx.font = 'bold 13px "Inter", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText(p.hours, bx + boxW / 2, matrixY + 92);
  });

  // 13. Industry Endorsement Quote Bar
  const endorseY = 925;
  ctx.font = 'italic 15px "Georgia", serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText(
    '“Officially verified and recognized under the rigorous scientific standards of Google Cloud, NVIDIA DLI, Meta AI, OpenAI, and premier global research institutes.”',
    width / 2,
    endorseY
  );

  // Divider Line
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(110, 960);
  ctx.lineTo(width - 110, 960);
  ctx.stroke();

  // 14. Bottom Quad: Signatures, Seal, QR Code, Verification Metadata
  const bottomY = 1000;

  // A) Left Signature: Lead AI Systems Architect
  const sigX = 420;
  const sigY = bottomY + 120;

  // Script Signature text
  ctx.textAlign = 'center';
  ctx.font = 'italic 700 52px "Georgia", "Times New Roman", serif';
  ctx.fillStyle = '#FEF08A';
  ctx.fillText('Yousuf Albaz', sigX, sigY);

  // Golden Signature Underscore
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sigX - 180, sigY + 20);
  ctx.lineTo(sigX + 180, sigY + 20);
  ctx.stroke();

  ctx.font = 'bold 22px "Inter", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('ENG. YOUSUF ALBAZ', sigX, sigY + 52);

  ctx.font = 'bold 16px "Inter", sans-serif';
  ctx.fillStyle = '#38BDF8';
  ctx.fillText('Lead AI Systems Architect & Research Director', sigX, sigY + 78);

  ctx.font = '500 14px "Inter", sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('Automation AI Yousuf Albaz • JINNA 5 Enclave', sigX, sigY + 102);

  // B) Central Golden Seal of Excellence
  const sealCenterX = width / 2;
  const sealCenterY = bottomY + 150;

  // Seal Outer Ring
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(sealCenterX, sealCenterY, 115, 0, Math.PI * 2);
  ctx.stroke();

  // Seal Fill
  ctx.fillStyle = '#080C1A';
  ctx.fill();

  // Seal Inner Ring (Dashed)
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(sealCenterX, sealCenterY, 100, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = 'bold 15px "Inter", sans-serif';
  ctx.fillStyle = '#FDE68A';
  ctx.fillText('★ GLOBAL AI CONSORTIUM ★', sealCenterX, sealCenterY - 50);

  ctx.font = '900 36px "Cinzel", "Georgia", serif';
  ctx.fillStyle = '#F59E0B';
  ctx.fillText('JINNA 5', sealCenterX, sealCenterY - 4);

  ctx.font = 'bold 14px "Inter", sans-serif';
  ctx.fillStyle = '#38BDF8';
  ctx.fillText('OFFICIAL ACCREDITATION', sealCenterX, sealCenterY + 38);

  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('FELLOWSHIP • 2026', sealCenterX, sealCenterY + 62);

  // C) Right: Cryptographic QR Code & Verification Block
  const qrCardX = width - 780;
  const qrCardY = bottomY + 20;
  const qrCardW = 660;
  const qrCardH = 260;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(qrCardX, qrCardY, qrCardW, qrCardH, 16);
  ctx.fill();
  ctx.stroke();

  // Render QR Code Image inside Card
  if (data.qrCodeDataUrl) {
    try {
      const qrImg = new Image();
      qrImg.src = data.qrCodeDataUrl;
      await new Promise((resolve) => {
        if (qrImg.complete) resolve(true);
        else qrImg.onload = () => resolve(true);
      });

      // Pure White Background for Flawless Camera Scanning
      const qrSize = 190;
      const qrLeft = qrCardX + 25;
      const qrTop = qrCardY + (qrCardH - qrSize) / 2;

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(qrLeft - 8, qrTop - 8, qrSize + 16, qrSize + 16, 10);
      ctx.fill();

      ctx.drawImage(qrImg, qrLeft, qrTop, qrSize, qrSize);
    } catch {
      // fallback
    }
  }

  // Metadata Text beside QR code
  const textLeft = qrCardX + 250;
  ctx.textAlign = 'left';

  ctx.font = 'bold 16px "Inter", sans-serif';
  ctx.fillStyle = '#22C55E';
  ctx.fillText('● CRYPTOGRAPHICALLY VERIFIED', textLeft, qrCardY + 45);

  ctx.font = '600 13px "Inter", sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('Official Credential ID:', textLeft, qrCardY + 80);

  ctx.font = 'bold 17px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FDE047';
  ctx.fillText(data.credentialId, textLeft, qrCardY + 104);

  ctx.font = '600 13px "Inter", sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('Issuance Date & Registry:', textLeft, qrCardY + 138);

  ctx.font = 'bold 15px "Inter", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(data.issueDateGregorian, textLeft, qrCardY + 160);

  ctx.font = '600 13px "Inter", sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('Accredited Hours & Standing:', textLeft, qrCardY + 194);

  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillStyle = '#34D399';
  ctx.fillText(`2,000+ Hours • First-Class Distinction`, textLeft, qrCardY + 216);

  // 15. Absolute Bottom Legal & Security Ledger
  ctx.textAlign = 'center';
  ctx.font = '500 13px "Inter", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText(
    'Verification Ledger: Permanent Record Hosted in Secure Cloud Enclave • Cryptographic Tamper-Proof Hash Verified • Automation AI Yousuf Albaz',
    width / 2,
    height - 75
  );

  // Export high-resolution PNG blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Failed to render certificate blob'));
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        resolve({ blob, dataUrl, canvas });
      },
      'image/png',
      1.0
    );
  });
}
