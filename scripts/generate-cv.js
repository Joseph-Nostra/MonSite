import puppeteer from 'puppeteer';

(async () => {
  console.log('--- Génération du PDF en cours ---');
  
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: "new"
  });
  
  const page = await browser.newPage();

  // Go to the CV page
  // Note: Make sure your dev server (npm run dev) is running!
  await page.goto('http://localhost:5173/cv', {
    waitUntil: 'networkidle0',
  });

  // Emulate print media
  await page.emulateMediaType('print');

  // Save as PDF
  await page.pdf({
    path: 'public/CV_Youssef_Zhar.pdf',
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    printBackground: true,
    format: 'A4',
  });

  console.log('✅ Succès : Le fichier CV_Youssef_Zhar.pdf a été généré !');

  await browser.close();
})();
