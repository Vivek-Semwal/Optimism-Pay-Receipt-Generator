require('dotenv').config();
const fs = require('fs');
const path = require('path');

const envPath = process.env.NODE_ENV === 'production'
  ? 'src/environments/environment.prod.ts'
  : 'src/environments/environment.ts';

const content = `
export const environment = {
  production: ${process.env.NODE_ENV === 'production'},
  openaiApiKey: '${process.env.OPENAI_API_KEY}'
};
`;

fs.writeFileSync(path.resolve(__dirname, '..', envPath), content);
console.log(`✅ Injected environment variables into ${envPath}`);

