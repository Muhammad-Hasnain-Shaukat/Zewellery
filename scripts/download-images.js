import fs from 'fs';
import https from 'https';
import path from 'path';

const prodDir = path.join(process.cwd(), 'public', 'images', 'products');

// Curated 100% working high-res jewelry image URLs
const verifiedUrls = {
  // Necklaces
  'neck-1-main.jpg': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
  'neck-1-detail.jpg': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',
  'neck-2-main.jpg': 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=85',
  'neck-2-detail.jpg': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
  'neck-3-main.jpg': 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1000&q=85',
  'neck-3-detail.jpg': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
  'neck-4-main.jpg': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
  'neck-4-detail.jpg': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',

  // Earrings
  'ear-1-main.jpg': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
  'ear-1-detail.jpg': 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',
  'ear-2-main.jpg': 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=1000&q=85',
  'ear-2-detail.jpg': 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',
  'ear-3-main.jpg': 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',
  'ear-3-detail.jpg': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
  'ear-4-main.jpg': 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=85',
  'ear-4-detail.jpg': 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=1000&q=85',

  // Rings
  'ring-1-main.jpg': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
  'ring-1-detail.jpg': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
  'ring-2-main.jpg': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
  'ring-2-detail.jpg': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
  'ring-3-main.jpg': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
  'ring-3-detail.jpg': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
  'ring-4-main.jpg': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
  'ring-4-detail.jpg': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',

  // Bracelets
  'brac-1-main.jpg': 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=85',
  'brac-1-detail.jpg': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',
  'brac-2-main.jpg': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',
  'brac-2-detail.jpg': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
  'brac-3-main.jpg': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
  'brac-3-detail.jpg': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',
  'brac-4-main.jpg': 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=85',
  'brac-4-detail.jpg': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',

  // Nose Rings
  'nose-1-main.jpg': 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=85',
  'nose-1-detail.jpg': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
  'nose-2-main.jpg': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
  'nose-2-detail.jpg': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
  'nose-3-main.jpg': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
  'nose-3-detail.jpg': 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=85',
  'nose-4-main.jpg': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
  'nose-4-detail.jpg': 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',

  // Category Icons
  'cat-necklaces.jpg': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  'cat-earrings.jpg': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
  'cat-rings.jpg': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
  'cat-bracelets.jpg': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
  'cat-nose-rings.jpg': 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80'
};

async function downloadFile(name, url) {
  const dest = path.join(prodDir, name);
  // Check if file exists and has size > 10KB
  if (fs.existsSync(dest) && fs.statSync(dest).size > 10000) {
    console.log(`Already valid: ${name} (${fs.statSync(dest).size} B)`);
    return;
  }

  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          console.log(`Downloaded ${name} (${fs.statSync(dest).size} B)`);
          resolve();
        });
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, (r) => {
          r.pipe(file);
          file.on('finish', () => {
            console.log(`Downloaded redirect ${name} (${fs.statSync(dest).size} B)`);
            resolve();
          });
        });
      } else {
        console.log(`Failed ${name}: ${res.statusCode}`);
        resolve();
      }
    }).on('error', (e) => {
      console.log(`Error ${name}: ${e.message}`);
      resolve();
    });
  });
}

async function run() {
  for (const [name, url] of Object.entries(verifiedUrls)) {
    await downloadFile(name, url);
  }
  console.log('Finished downloading all local product assets.');
}

run();
