import fs from 'fs';
import { PNG } from 'pngjs';

// Test creating a PNG file
const png = new PNG({ width: 512, height: 512 });
for (let y = 0; y < png.height; y++) {
  for (let x = 0; x < png.width; x++) {
    const idx = (png.width * y + x) << 2;
    // Dark background #080B14
    png.data[idx] = 8;
    png.data[idx + 1] = 11;
    png.data[idx + 2] = 20;
    png.data[idx + 3] = 255;
  }
}

fs.writeFileSync('/tmp/test.png', PNG.sync.write(png));
console.log('PNG creation works! File size:', fs.statSync('/tmp/test.png').size);
