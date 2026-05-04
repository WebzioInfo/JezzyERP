import fs from 'fs';

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
        console.log(`Updated any types in ${filePath}`);
    }
}

replaceInFile('src/app/api/auth/register/route.ts', [
    ['async (tx) =>', 'async (tx: any) =>']
]);

replaceInFile('src/app/dashboard/clients/page.tsx', [
    ['.map((client) =>', '.map((client: any) =>']
]);

replaceInFile('src/app/dashboard/invoices/page.tsx', [
    ['.map((inv) =>', '.map((inv: any) =>']
]);

replaceInFile('src/app/dashboard/page.tsx', [
    ['.map((inv) =>', '.map((inv: any) =>']
]);

replaceInFile('src/app/dashboard/products/page.tsx', [
    ['.map((product) =>', '.map((product: any) =>']
]);

replaceInFile('src/lib/actions/billing.ts', [
    ['async (tx) =>', 'async (tx: any) =>']
]);

console.log('Any fixes complete.');
