/**
 * Word count verification script for Lumo's Dream Delivery Service.
 * Validates that all major story sections strictly adhere to the <= 150 words copy rule.
 */
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');

const sections = [
  { id: 'hero', name: 'Hero Welcome', max: 150 },
  { id: 'about', name: 'About & Trading Card', max: 150 },
  { id: 'story', name: 'Storybook Origin', max: 150 },
  { id: 'work', name: 'DreamOS Workshop', max: 150 },
  { id: 'map', name: 'Delivery Route Map', max: 150 },
  { id: 'footer', name: 'Community & Webring', max: 150 }
];

let hasErrors = false;

console.log('🌙 Auditing section word counts (<= 150 words guardrail)...');

for (const sec of sections) {
  // Simple regex to extract section inner HTML
  const regex = new RegExp(`<(section|footer)[^>]*id=["']${sec.id}["'][^>]*>([\\s\\S]*?)<\\/(section|footer)>`, 'i');
  const match = html.match(regex);

  if (!match) {
    console.warn(`⚠️ Warning: Section #${sec.id} not found in index.html`);
    continue;
  }

  // Strip script, style, SVG, and tags to count visible words
  const content = match[2]
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ');

  const words = content.trim().split(/\s+/).filter(w => w.length > 0 && !/^[^a-zA-Z0-9]+$/.test(w));
  const count = words.length;

  if (count > sec.max) {
    console.error(`❌ FAILED: #${sec.id} (${sec.name}) has ${count} words (Limit: ${sec.max})`);
    hasErrors = true;
  } else {
    console.log(`✅ PASSED: #${sec.id} (${sec.name}) has ${count} words (Limit: ${sec.max})`);
  }
}

if (hasErrors) {
  process.exit(1);
} else {
  console.log('✨ All sections strictly satisfy the <= 150 words guardrail!');
}
