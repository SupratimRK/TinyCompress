// Generate a screenshot of the application for the README
// This is a Node.js script that uses Puppeteer
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('Launching browser to take a screenshot...');
  
  // Launch browser
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1280,
      height: 800,
    },
    headless: true,
  });
  
  const page = await browser.newPage();
  
  // Navigate to the locally running app
  try {
    console.log('Navigating to application...');
    await page.goto('http://localhost:8888', { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for the app to be fully loaded
    await page.waitForSelector('.container', { timeout: 5000 });
    await page.waitForTimeout(2000); // Additional delay to ensure animations complete
    
    console.log('Taking screenshot...');
    await page.screenshot({
      path: path.join(__dirname, 'screenshot.png'),
      fullPage: false,
    });
    
    console.log('Screenshot saved as screenshot.png');
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
})();
