import fs from 'fs';
import path from 'path';

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    for (const [search, replace] of replacements) {
        if (content.includes(search)) {
            // Regex escape search
            const escapedSearch = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            const regex = new RegExp(escapedSearch, 'g');
            content = content.replace(regex, replace);
            modified = true;
        }
    }
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated imports in ${filePath}`);
    }
}

function walkSync(dir, filelist = []) {
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

const replacements = [
    ['@/modules/products/ProductForm', '@/components/products/ProductForm'],
    ['@/modules/products/actions', '@/lib/actions/products'],
    ['@/modules/clients/ClientForm', '@/components/clients/ClientForm'],
    ['@/modules/clients/actions', '@/lib/actions/clients'],
    ['@/modules/billing/BillingEngine', '@/components/billing/BillingEngine'],
    ['@/modules/billing/actions', '@/lib/actions/billing'],
    ['@/app/types/', '@/types/'],
    ['@/app/data/', '@/data/'],
    ['@/app/lib/utils/date', '@/utils/date'],
    ['@/app/lib/utils/numberToWords', '@/utils/numberToWords'],
    ['@/app/components/', '@/components/layout/']
];

files.forEach(file => replaceInFile(file, replacements));
console.log('Import replacements complete.');
