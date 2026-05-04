import fs from 'fs';
import path from 'path';

function replaceInFile(filePath, replacements) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    for (const [search, replace] of replacements) {
        if (content.includes(search)) {
            content = content.split(search).join(replace);
            modified = true;
        }
    }
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated imports in ${filePath}`);
    }
}

function walkSync(dir, filelist = []) {
    if (!fs.existsSync(dir)) return filelist;
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        try {
            filelist = fs.statSync(dirFile).isDirectory() 
                ? walkSync(dirFile, filelist) 
                : filelist.concat(dirFile);
        } catch (err) {}
    });
    return filelist;
}

const files = walkSync('src').filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
files.push('middleware.ts');

const replacements = [
    ['@/lib/utils', '@/utils'],
    ['../types/invoice', '@/types/invoice'],
    ['./actions', '@/lib/actions/clients'], // We only had clients and products form failing on this
    ['../utils/numberToWords', '@/utils/numberToWords'],
    ['../utils/date', '@/utils/date']
];

files.forEach(file => replaceInFile(file, replacements));

// Manual fixes for specific files
replaceInFile('src/components/products/ProductForm.tsx', [
    ['@/lib/actions/clients', '@/lib/actions/products'] // Revert the global replacement for products
]);

replaceInFile('middleware.ts', [
    ['./lib/auth', '@/lib/auth']
]);

replaceInFile('src/app/api/invoices/route.ts', [
    ['verifyAuth', 'verifySessionCookie']
]);

console.log('TS fixes complete.');
