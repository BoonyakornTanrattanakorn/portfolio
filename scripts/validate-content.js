import { validateAllContent } from '../site/src/content/validate.js';

const result = validateAllContent({ rootDir: process.cwd() });
if (!result.valid) {
  console.error('Content validation failed with the following errors:');
  for (const err of result.errors) {
    console.error(` - ${err}`);
  }
  process.exit(1);
}

console.log(
  `Content validation passed successfully! (${result.counts.projects} projects, ${result.counts.websites} websites verified).`
);
