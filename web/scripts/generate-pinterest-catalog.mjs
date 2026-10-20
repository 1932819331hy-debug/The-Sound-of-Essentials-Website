/**
 * Generate Pinterest Catalog RSS 2.0 Feed for The Sound of Essentials
 * Conforms to Pinterest Catalogs & Google Merchant Product RSS Specifications
 * Source of truth: .agents/core/pricing.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pricingPath = path.resolve(__dirname, '../../.agents/core/pricing.json');
const outputPath = path.resolve(__dirname, '../public/pinterest-catalog.xml');

const pricingData = JSON.parse(fs.readFileSync(pricingPath, 'utf8'));

const DOMAIN = 'https://thesoundofessentials.com';

const PRODUCT_METADATA = {
  'rhythm-quest-album': {
    link: `${DOMAIN}/listen`,
    image: `${DOMAIN}/soe_deluxe_album_storybook_materials.jpg`,
    category: 'Media > Music',
    productType: 'Early Learning > Screen-Free Music > 19 Studio Acoustic Tracks',
    gtin: '885000556098',
  },
  'quest-starter-pack': {
    link: `${DOMAIN}/starter-pack`,
    image: `${DOMAIN}/soe_box_learning_experience.png`,
    category: 'Media > Books > Print Books',
    productType: 'Early Learning > Tactile Activities > 40-Page Coloring Book & Bedtime Reset',
  },
  'rhythm-quest-ebook': {
    link: `${DOMAIN}/rhythm-quest`,
    image: `${DOMAIN}/child_reading_rhythm_quest_official_cover.webp`,
    category: 'Media > Books > E-Books',
    productType: 'Early Learning > Storybooks > 66-Page Illustrated Journey Through 7 Lands',
  },
  'summer-stretch-workbook-digital': {
    link: `${DOMAIN}/rhythm-ready`,
    image: `${DOMAIN}/child_reading_rhythm_quest_official_cover.webp`,
    category: 'Media > Books > Workbooks',
    productType: 'Early Learning > Curriculum > 8-Week Screen-Free Readiness Quest (Digital PDF)',
  },
  'summer-stretch-workbook-print': {
    link: `${DOMAIN}/rhythm-ready`,
    image: `${DOMAIN}/child_reading_rhythm_quest_official_cover.webp`,
    category: 'Media > Books > Workbooks',
    productType: 'Early Learning > Curriculum > 8-Week Screen-Free Readiness Quest (454-Page Print)',
  },
  'picture-dictionary': {
    link: `${DOMAIN}/dictionary`,
    image: `${DOMAIN}/soe_album_showcase_canon.jpg`,
    category: 'Media > Books > Dictionaries & Thesauruses',
    productType: 'Early Learning > Vocabulary > 4,232 Words Across 125 Full-Color Scenes',
  },
  'full-quest-bundle': {
    link: `${DOMAIN}/rhythm-quest`,
    image: `${DOMAIN}/soe_deluxe_album_storybook_materials.jpg`,
    category: 'Media > Books',
    productType: 'Early Learning > Complete Curriculum > 19-Track Album + Dictionary + Workbook + Ebook',
  },
};

function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const itemsXml = pricingData.product_ladder
  .filter((prod) => PRODUCT_METADATA[prod.id])
  .map((prod) => {
    const meta = PRODUCT_METADATA[prod.id];
    const priceFormatted = `${prod.price.toFixed(2)} USD`;
    const description = prod.purpose
      ? `${prod.name}. ${prod.purpose} Target audience: Ages 2 to 7. Scientifically grounded, screen-free early learning.`
      : `${prod.name}. Scientifically grounded, screen-free early childhood development for ages 2 to 7 across the 7 Lands of Sound.`;

    return `    <item>
      <g:id>${escapeXml(prod.sku)}</g:id>
      <g:title>${escapeXml(prod.name)} (Ages 2–7)</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(meta.link)}</g:link>
      <g:image_link>${escapeXml(meta.image)}</g:image_link>
      <g:brand>The Sound of Essentials</g:brand>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${priceFormatted}</g:price>
      <g:google_product_category>${escapeXml(meta.category)}</g:google_product_category>
      <g:product_type>${escapeXml(meta.productType)}</g:product_type>
      <g:age_group>toddler</g:age_group>
      <g:gender>unisex</g:gender>
      ${meta.gtin ? `<g:gtin>${meta.gtin}</g:gtin>` : '<g:identifier_exists>false</g:identifier_exists>'}
    </item>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>The Sound of Essentials: Rhythm Quest Product Catalog</title>
    <link>https://thesoundofessentials.com</link>
    <description>A scientifically grounded, music-driven screen-free learning ecosystem for early childhood development (Ages 2–7).</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemsXml}
  </channel>
</rss>
`;

fs.writeFileSync(outputPath, xml.trim(), 'utf8');
console.log(`Successfully generated Pinterest Catalog Feed with ${pricingData.product_ladder.filter(p => PRODUCT_METADATA[p.id]).length} products at ${outputPath}`);
