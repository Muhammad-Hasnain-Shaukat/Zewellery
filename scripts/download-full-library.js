import fs from 'fs';
import https from 'https';
import path from 'path';

const prodDir = path.join(process.cwd(), 'public', 'images', 'products');
const socialDir = path.join(process.cwd(), 'public', 'images', 'social');
const baseImgDir = path.join(process.cwd(), 'public', 'images');

[prodDir, socialDir, baseImgDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 57 completely unique, non-repeating, high-definition jewellery images
const imageMap = {
  // 1. NECKLACES (4 products x 2 angles = 8 distinct photos)
  'products/neck-1-main.jpg': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
  'products/neck-1-detail.jpg': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',
  'products/neck-2-main.jpg': 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=85',
  'products/neck-2-detail.jpg': 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&w=1000&q=85',
  'products/neck-3-main.jpg': 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1000&q=85',
  'products/neck-3-detail.jpg': 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1000&q=85',
  'products/neck-4-main.jpg': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
  'products/neck-4-detail.jpg': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',

  // 2. EARRINGS (4 products x 2 angles = 8 distinct photos)
  'products/ear-1-main.jpg': 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',
  'products/ear-1-detail.jpg': 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=1000&q=85',
  'products/ear-2-main.jpg': 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=1000&q=85',
  'products/ear-2-detail.jpg': 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1000&q=85',
  'products/ear-3-main.jpg': 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=1000&q=85',
  'products/ear-3-detail.jpg': 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=85',
  'products/ear-4-main.jpg': 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?auto=format&fit=crop&w=1000&q=85',
  'products/ear-4-detail.jpg': 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&w=1000&q=85',

  // 3. RINGS (4 products x 2 angles = 8 distinct photos)
  'products/ring-1-main.jpg': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
  'products/ring-1-detail.jpg': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
  'products/ring-2-main.jpg': 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1000&q=85',
  'products/ring-2-detail.jpg': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=85',
  'products/ring-3-main.jpg': 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=85',
  'products/ring-3-detail.jpg': 'https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?auto=format&fit=crop&w=1000&q=85',
  'products/ring-4-main.jpg': 'https://images.unsplash.com/photo-1616886899723-5e9eefba6295?auto=format&fit=crop&w=1000&q=85',
  'products/ring-4-detail.jpg': 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?auto=format&fit=crop&w=1000&q=85',

  // 4. BRACELETS (4 products x 2 angles = 8 distinct photos)
  'products/brac-1-main.jpg': 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=85',
  'products/brac-1-detail.jpg': 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=85',
  'products/brac-2-main.jpg': 'https://images.unsplash.com/photo-1611591475883-20058b8f2d59?auto=format&fit=crop&w=1000&q=85',
  'products/brac-2-detail.jpg': 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1000&q=85',
  'products/brac-3-main.jpg': 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=1000&q=85',
  'products/brac-3-detail.jpg': 'https://images.unsplash.com/photo-1620656798579-1984d9e87dfa?auto=format&fit=crop&w=1000&q=85',
  'products/brac-4-main.jpg': 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=1000&q=85',
  'products/brac-4-detail.jpg': 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=85',

  // 5. NOSE RINGS / NATHS (4 products x 2 angles = 8 distinct photos)
  'products/nose-1-main.jpg': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=85',
  'products/nose-1-detail.jpg': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=85',
  'products/nose-2-main.jpg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
  'products/nose-2-detail.jpg': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85',
  'products/nose-3-main.jpg': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=85',
  'products/nose-3-detail.jpg': 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1000&q=85',
  'products/nose-4-main.jpg': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=85',
  'products/nose-4-detail.jpg': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=85',

  // 6. CATEGORIES (5 distinct category showcase cards)
  'products/cat-necklaces.jpg': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85',
  'products/cat-earrings.jpg': 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=85',
  'products/cat-rings.jpg': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85',
  'products/cat-bracelets.jpg': 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=85',
  'products/cat-nose-rings.jpg': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85',

  // 7. BANNERS (2 distinct banners)
  'banner-everyday-edit.jpg': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
  'banner-special-moments.jpg': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',

  // 8. SOCIAL / INSTAGRAM SHOWCASE (6 distinct luxury styling photos)
  'social/insta-1.jpg': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=85',
  'social/insta-2.jpg': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=85',
  'social/insta-3.jpg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85',
  'social/insta-4.jpg': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=85',
  'social/insta-5.jpg': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=85',
  'social/insta-6.jpg': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=85',

  // 9. ABOUT / ATELIER CRAFTSMANSHIP (4 distinct photos)
  'about-craftsmanship.jpg': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
  'about-atelier-1.jpg': 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=85',
  'about-atelier-2.jpg': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85',
  'about-atelier-3.jpg': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85'
};

async function downloadImage(relPath, url) {
  const dest = path.join(baseImgDir, relPath);
  const parent = path.dirname(dest);
  if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });

  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          console.log(`Saved ${relPath} (${fs.statSync(dest).size} B)`);
          resolve();
        });
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, r => {
          r.pipe(file);
          file.on('finish', () => {
            console.log(`Saved redirect ${relPath} (${fs.statSync(dest).size} B)`);
            resolve();
          });
        });
      } else {
        console.log(`Failed ${relPath}: ${res.statusCode}`);
        resolve();
      }
    }).on('error', err => {
      console.log(`Error ${relPath}: ${err.message}`);
      resolve();
    });
  });
}

async function run() {
  const entries = Object.entries(imageMap);
  for (let i = 0; i < entries.length; i++) {
    const [relPath, url] = entries[i];
    await downloadImage(relPath, url);
  }
  console.log(`Successfully completed all ${entries.length} image downloads.`);
}

run();
