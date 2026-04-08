import fs from 'fs';
import path from 'path';

const srcDir = './src';

const replacements = [
  { from: /@\/lib\/actions/g, to: '@/server/actions' },
  { from: /@\/lib\/schemas/g, to: '@/server/validators' },
  { from: /@\/lib\/prisma/g, to: '@/db/prisma/client' },
  { from: /@\/lib\/db/g, to: '@/db/prisma/client' },
];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;
      for (const { from, to } of replacements) {
        if (from.test(content)) {
          content = content.replace(from, to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    }
  }
}

walk(srcDir);
