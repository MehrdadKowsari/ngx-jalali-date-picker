const fs = require('fs').promises;

async function setGa() {
  const html = await fs.readFile('./dist/index.html', 'utf-8');
  await fs.writeFile('./dist/index.html', newHtml);
}

setGa();
