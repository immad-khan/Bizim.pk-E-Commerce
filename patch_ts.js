const fs = require('fs');
let code = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

code = code.replace(/interface SiteCustomization \{[\s\S]*?heroImageBottomRightSubtitle: string;\s*\}/m, 
    "interface SiteCustomization {\n  heroVideoWebm: string;\n  heroVideoMp4: string;\n  heroImageLeft: string;\n  heroImageLeftTitle: string;\n  heroImageLeftSubtitle: string;\n  heroImageLeftButtonText: string;\n  heroImageTopRight: string;\n  heroImageTopRightTitle: string;\n  heroImageTopRightSubtitle: string;\n  heroImageTopRightButtonText: string;\n  heroImageBottomRight: string;\n  heroImageBottomRightTitle: string;\n  heroImageBottomRightSubtitle: string;\n  heroImageBottomRightButtonText: string;\n}");

code = code.replace(/const \[customizations, setCustomizations\] = useState<SiteCustomization>\(\{[\s\S]*?heroImageBottomRightSubtitle: ''\s*\}\)/m, 
    "const [customizations, setCustomizations] = useState<SiteCustomization>({\n    heroVideoWebm: '',\n    heroVideoMp4: '',\n    heroImageLeft: '',\n    heroImageLeftTitle: '',\n    heroImageLeftSubtitle: '',\n    heroImageLeftButtonText: '',\n    heroImageTopRight: '',\n    heroImageTopRightTitle: '',\n    heroImageTopRightSubtitle: '',\n    heroImageTopRightButtonText: '',\n    heroImageBottomRight: '',\n    heroImageBottomRightTitle: '',\n    heroImageBottomRightSubtitle: '',\n    heroImageBottomRightButtonText: ''\n  })");

fs.writeFileSync('app/admin/dashboard/page.tsx', code);
console.log('Fixed TypeScript errors');
