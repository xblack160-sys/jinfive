import zlib
import struct
import math
import os

def create_png(width, height, filename, is_maskable=False):
    # RGBA image buffer
    # Each row: 1 byte filter (0) + width * 4 bytes RGBA
    raw_data = bytearray()
    cx, cy = width / 2.0, height / 2.0
    outer_r = min(width, height) * 0.46
    safe_r = outer_r * 0.78 if is_maskable else outer_r

    for y in range(height):
        raw_data.append(0)  # Filter type 0 (None)
        ny = (y - cy) / cy  # -1 to 1
        for x in range(width):
            nx = (x - cx) / cx  # -1 to 1
            dist = math.sqrt((x - cx)**2 + (y - cy)**2)
            
            # Base dark luxury background
            # Gradient from deep dark navy/indigo (top-left) to deep cyan/black (bottom-right)
            t = (nx + ny + 2) / 4.0
            r = int(10 + t * 15)
            g = int(12 + t * 25)
            b = int(24 + t * 40)
            a = 255

            # Circular / Rounded squircle ambient glow
            if dist < safe_r:
                factor = 1.0 - (dist / safe_r)
                # Cyan/Gold core aura
                r = min(255, int(r + factor * 40))
                g = min(255, int(g + factor * 85))
                b = min(255, int(b + factor * 130))

            # Hexagonal frame ring
            # Angle around center
            angle = math.atan2(y - cy, x - cx)
            # Hexagon radius at this angle:
            # cos(pi/6) / cos((angle mod (2pi/6)) - pi/6)
            mod_angle = (angle % (math.pi / 3.0)) - (math.pi / 6.0)
            hex_r = (safe_r * 0.85) / math.cos(mod_angle)

            if abs(dist - hex_r) < (width * 0.025):
                # Gradient gold to cyan border
                border_t = (math.sin(angle) + 1) / 2.0
                r = int(34 * (1 - border_t) + 245 * border_t)
                g = int(211 * (1 - border_t) + 158 * border_t)
                b = int(238 * (1 - border_t) + 11 * border_t)
                a = 255
            elif dist < hex_r:
                # Inner emblem core
                # Stylized "J" or center star
                inner_dist = math.sqrt((x - cx)**2 + (y - cy)**2)
                if inner_dist < safe_r * 0.28:
                    # Glowing central node
                    core_f = 1.0 - (inner_dist / (safe_r * 0.28))
                    r = int(224 * core_f + r * (1 - core_f))
                    g = int(242 * core_f + g * (1 - core_f))
                    b = int(254 * core_f + b * (1 - core_f))

            raw_data.extend([r, g, b, a])

    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    png_bytes = b'\x89PNG\r\n\x1a\n'
    # IHDR
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png_bytes += chunk(b'IHDR', ihdr_data)
    # IDAT
    compressed = zlib.compress(bytes(raw_data), level=9)
    png_bytes += chunk(b'IDAT', compressed)
    # IEND
    png_bytes += chunk(b'IEND', b'')

    with open(filename, 'wb') as f:
        f.write(png_bytes)
    print(f"Generated {filename} ({width}x{height})")

os.makedirs('public', exist_ok=True)
create_png(192, 192, 'public/pwa-192x192.png', is_maskable=False)
create_png(512, 512, 'public/pwa-512x512.png', is_maskable=False)
create_png(512, 512, 'public/pwa-maskable-512x512.png', is_maskable=True)
create_png(180, 180, 'public/apple-touch-icon.png', is_maskable=False)
create_png(64, 64, 'public/favicon.ico', is_maskable=False)
print("All PWA icons generated successfully!")
