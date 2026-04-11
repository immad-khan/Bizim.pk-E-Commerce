const fs = require('fs');

const pagePath = 'components/scroll-animation.tsx';
let data = fs.readFileSync(pagePath, 'utf8');

// 1. Add Type Import
if (!data.includes('import { SiteCustomization }')) {
    data = data.replace("import { useEffect, useState } from 'react'", "import { useEffect, useState } from 'react'\nimport { SiteCustomization } from '@/lib/site-customization'");
}

// 2. Change Props
if (!data.includes('customizations?: SiteCustomization | null')) {
    data = data.replace('export default function ScrollAnimation() {', 'export default function ScrollAnimation({ customizations }: { customizations?: SiteCustomization | null }) {');
}

// 3. Replace Video URLs
data = data.replace(
    '<source src="/videos/Smoothly_transition_from_202604100021.webm" type="video/webm" />',
    '<source src={customizations?.heroVideoWebm || "/videos/Smoothly_transition_from_202604100021.webm"} type="video/webm" />'
);

data = data.replace(
    '<source src="/videos/Smoothly_transition_from_202604100021.mp4" type="video/mp4" />',
    '<source src={customizations?.heroVideoMp4 || "/videos/Smoothly_transition_from_202604100021.mp4"} type="video/mp4" />'
);

fs.writeFileSync(pagePath, data);

// -------- PATCH hero-grid.tsx ---------
const gridPath = 'components/hero-grid.tsx';
let gridData = fs.readFileSync(gridPath, 'utf8');

if (!gridData.includes('import { SiteCustomization }')) {
    gridData = gridData.replace("import Image from 'next/image'", "import Image from 'next/image'\nimport { SiteCustomization } from '@/lib/site-customization'");
}

if (!gridData.includes('customizations?: SiteCustomization | null')) {
    gridData = gridData.replace('export default function HeroGrid() {', 'export default function HeroGrid({ customizations }: { customizations?: SiteCustomization | null }) {');
}

gridData = gridData.replace(
    'src="https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048"',
    'src={customizations?.heroImageLeft || "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048"}'
);

gridData = gridData.replace(
    'src="https://aodour.pk/cdn/shop/files/O1CN01o62e3l1uX7OpeS61B__2670546046-0-cib_bde64d04-4f05-4f40-bffa-e7eeed64d6da.jpg?v=1740306032&width=2048"',
    'src={customizations?.heroImageTopRight || "https://aodour.pk/cdn/shop/files/O1CN01o62e3l1uX7OpeS61B__2670546046-0-cib_bde64d04-4f05-4f40-bffa-e7eeed64d6da.jpg?v=1740306032&width=2048"}'
);

gridData = gridData.replace(
    'src="https://aodour.pk/cdn/shop/files/O1CN01aU6gA81uX7Op54X5m__2670546046-0-cib_b1cba560-63ce-4277-bfdd-7ee8ec5fdedf.jpg?v=1740306031&width=2048"',
    'src={customizations?.heroImageBottomRight || "https://aodour.pk/cdn/shop/files/O1CN01aU6gA81uX7Op54X5m__2670546046-0-cib_b1cba560-63ce-4277-bfdd-7ee8ec5fdedf.jpg?v=1740306031&width=2048"}'
);

fs.writeFileSync(gridPath, gridData);
