const fs = require('fs');

const dash = fs.readFileSync('src/components/seller/SellerDashboard.jsx', 'utf8');
const inv = fs.readFileSync('src/components/seller/InventoryManagement.jsx', 'utf8');
const add = fs.readFileSync('src/components/seller/AddNewProduct.jsx', 'utf8');
const store = fs.readFileSync('src/components/seller/StoreSetup.jsx', 'utf8');

function extractMain(jsx) {
  const match = jsx.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return match ? match[1] : '';
}

function extractSidebar(jsx) {
  const match = jsx.match(/<aside[^>]*>([\s\S]*?)<\/aside>/i);
  return match ? match[0] : '';
}

function extractMobileNav(jsx) {
  const match = jsx.match(/<nav className="md:hidden[^>]*>([\s\S]*?)<\/nav>/i);
  return match ? match[0] : '';
}

const mainDash = extractMain(dash);
const mainInv = extractMain(inv);
const mainAdd = extractMain(add);
const mainStore = extractMain(store);

const sidebar = extractSidebar(dash);
const mobileNav = extractMobileNav(dash);

// ... wait, I've restored SellerDashboard.jsx, so the generated one is gone!
// I need to re-run the convert script but save the output to different names so I don't overwrite SellerDashboard.jsx.
