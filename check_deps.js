const fs = require('fs');
const path = require('path');
const pkgs = new Set();
const walk = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.js') || p.endsWith('.ts') || p.endsWith('.tsx')) {
      const content = fs.readFileSync(p, 'utf8');
      const matches = content.matchAll(/from\s+['"]([^.\/][^'"]+)['"]/g);
      for (const m of matches) {
        let pkg = m[1].split('/')[0].startsWith('@') ? m[1].split('/').slice(0, 2).join('/') : m[1].split('/')[0];
        pkgs.add(pkg);
      }
      
      const requires = content.matchAll(/require\(['"]([^.\/][^'"]+)['"]\)/g);
      for (const m of requires) {
        let pkg = m[1].split('/')[0].startsWith('@') ? m[1].split('/').slice(0, 2).join('/') : m[1].split('/')[0];
        pkgs.add(pkg);
      }
    }
  }
};
walk('./src');
console.log([...pkgs].sort());
