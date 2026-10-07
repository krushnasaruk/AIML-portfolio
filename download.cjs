const fs = require('fs');
const path = require('path');

const downloadImage = async (url, filepath) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
  } catch (err) {
    console.error(`Failed to download ${url}:`, err);
  }
};

const main = async () => {
  const dir = path.join(__dirname, 'public', 'images');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const promises = [];
  for (let i = 1; i <= 30; i++) {
    console.log(`Downloading image ${i}...`);
    // Using picsum.photos for guaranteed downloads since loremflickr throws unauthorized
    const url = `https://picsum.photos/seed/aiml${i}/800/1200`;
    const filepath = path.join(dir, `item-${i}.jpg`);
    promises.push(downloadImage(url, filepath));
  }
  
  await Promise.all(promises);
  console.log('All images downloaded successfully using picsum!');
};

main();
