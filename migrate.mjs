import fs from 'fs';
import path from 'path';

const move = (src, dest) => {
    if (fs.existsSync(src)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.renameSync(src, dest);
        console.log(`Moved ${src} to ${dest}`);
    } else {
        console.log(`Warning: ${src} does not exist.`);
    }
};

const moveDirContents = (srcDir, destDir) => {
    if (fs.existsSync(srcDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        const items = fs.readdirSync(srcDir);
        for (const item of items) {
            move(path.join(srcDir, item), path.join(destDir, item));
        }
    }
};

// 1. App routing files
move('app/api', 'src/app/api');
move('app/dashboard', 'src/app/dashboard');
move('app/globals.css', 'src/app/globals.css');
move('app/layout.tsx', 'src/app/layout.tsx');
move('app/page.tsx', 'src/app/page.tsx');
move('app/favicon.ico', 'src/app/favicon.ico');

// 2. Types
moveDirContents('app/types', 'src/types');

// 3. Lib & Utils
// app/lib contains pdf and utils
move('app/lib/pdf', 'src/lib/pdf');
if (fs.existsSync('app/lib/utils')) {
    moveDirContents('app/lib/utils', 'src/utils');
}
if (fs.existsSync('lib/utils.ts')) {
    move('lib/utils.ts', 'src/utils/index.ts');
}

move('lib/auth.ts', 'src/lib/auth.ts');
move('lib/db.ts', 'src/lib/db.ts');
move('lib/env.ts', 'src/lib/env.ts');
move('lib/prisma.ts', 'src/lib/prisma.ts');
moveDirContents('lib/schemas', 'src/lib/schemas');

// 4. UI & Hooks
moveDirContents('ui', 'src/ui');
moveDirContents('hooks', 'src/hooks');

// 5. Components & Modules
moveDirContents('app/components', 'src/components/layout');
moveDirContents('app/billing', 'src/components/billing');

if (fs.existsSync('modules/billing/BillingEngine.tsx')) {
    move('modules/billing/BillingEngine.tsx', 'src/components/billing/BillingEngine.tsx');
}
if (fs.existsSync('modules/billing/actions.ts')) {
    move('modules/billing/actions.ts', 'src/lib/actions/billing.ts');
}

if (fs.existsSync('modules/clients')) {
    move('modules/clients/ClientForm.tsx', 'src/components/clients/ClientForm.tsx');
    move('modules/clients/actions.ts', 'src/lib/actions/clients.ts');
}

if (fs.existsSync('modules/products')) {
    move('modules/products/ProductForm.tsx', 'src/components/products/ProductForm.tsx');
    move('modules/products/actions.ts', 'src/lib/actions/products.ts');
}

// Any other data folders
moveDirContents('app/data', 'src/data');

console.log("Migration script complete.");
