require('dotenv').config();
const fs = require('fs');
const path = './src/environments/environment.prod.ts';

const apiKey = process.env.NG_OPENAI_API_KEY;

const fileContent = `
export const environment = {
  production: true,
  openaiApiKey: '${apiKey}'
};
`;

fs.writeFileSync(path, fileContent);
console.log('✅ OpenAI key injected into environment.prod.ts');
