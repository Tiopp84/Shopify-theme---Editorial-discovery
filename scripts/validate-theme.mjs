import { readFileSync, readdirSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';

const root = new URL('../', import.meta.url).pathname.replace(/^\/(.:\/)/, '$1');
const themeRoot = join(root, 'theme');
const errors = [];

function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

function jsonc(text) {
  return JSON.parse(
    text
      .replace(/^\s*\/\*[\s\S]*?\*\//, '')
      .replace(/,\s*([}\]])/g, '$1'),
  );
}

function flatten(value, prefix = '', output = new Set()) {
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object' && !Array.isArray(child)) flatten(child, path, output);
    else output.add(path);
  }
  return output;
}

const themeFiles = filesIn(themeRoot);
for (const file of themeFiles.filter((path) => extname(path) === '.json')) {
  try {
    jsonc(readFileSync(file, 'utf8'));
  } catch (error) {
    errors.push(`${relative(root, file)}: invalid JSON/JSONC (${error.message})`);
  }
}

const storefrontKeys = flatten(jsonc(readFileSync(join(themeRoot, 'locales/en.default.json'), 'utf8')));
const schemaKeys = flatten(jsonc(readFileSync(join(themeRoot, 'locales/en.default.schema.json'), 'utf8')));

function schemaFromLiquid(file) {
  const match = readFileSync(file, 'utf8').match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (!match) return null;
  try {
    return jsonc(match[1]);
  } catch (error) {
    errors.push(`${relative(root, file)}: invalid section/block schema (${error.message})`);
    return null;
  }
}

for (const file of themeFiles.filter((path) => path.startsWith(join(themeRoot, 'sections')) && extname(path) === '.liquid')) {
  const schema = schemaFromLiquid(file);
  if (!schema) continue;
  if (!schema.enabled_on && !schema.disabled_on) {
    errors.push(`${relative(root, file)}: section schema must declare enabled_on or disabled_on`);
  }
  if (schema.enabled_on && schema.disabled_on) {
    errors.push(`${relative(root, file)}: section schema cannot declare both enabled_on and disabled_on`);
  }
  if (schema.blocks?.some((block) => block.type === '@theme')) {
    errors.push(`${relative(root, file)}: generic @theme blocks are not allowed; use an explicit block allowlist`);
  }
}
const translationPattern = /['"]([^'"]+)['"]\s*\|\s*t\b/g;
for (const file of themeFiles.filter((path) => ['.liquid', '.json'].includes(extname(path)))) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(translationPattern)) {
    const catalog = match[1].startsWith('general.') || match[1].startsWith('labels.') || match[1].startsWith('options.')
      ? schemaKeys
      : storefrontKeys;
    if (!catalog.has(match[1])) errors.push(`${relative(root, file)}: missing English translation key ${match[1]}`);
  }
}

const runtimeFiles = themeFiles.filter((path) => ['.js', '.liquid'].includes(extname(path)));
const approvedSelfHostedRuntimeFiles = new Set(['gsap-3.13.0.min.js', 'scroll-trigger-3.13.0.min.js']);
for (const file of runtimeFiles) {
  const text = readFileSync(file, 'utf8');
  if (/\bdebugger\s*;|console\.(?:log|debug|trace)\s*\(/.test(text)) {
    errors.push(`${relative(root, file)}: debug statement found`);
  }
  if (extname(file) === '.js' && !approvedSelfHostedRuntimeFiles.has(basename(file)) && /https?:\/\//i.test(text)) {
    errors.push(`${relative(root, file)}: remote runtime URL found in JavaScript`);
  }
  if (/<script\b[^>]*\bsrc\s*=\s*['"]https?:\/\//i.test(text)) {
    errors.push(`${relative(root, file)}: remote script source found`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Theme validation passed: ${themeFiles.length} files, ${storefrontKeys.size} storefront keys, ${schemaKeys.size} schema keys.`);
