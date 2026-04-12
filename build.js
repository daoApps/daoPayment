#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');

console.log('Building Monad Agentic Payment system...');
console.log(`Current platform: ${os.platform()}`);

try {
  // 清理之前的构建
  console.log('Cleaning previous build...');
  execSync('rm -rf dist', { stdio: 'inherit', shell: true });
  
  // 编译 TypeScript
  console.log('Compiling TypeScript...');
  execSync('npx tsc', { stdio: 'inherit', shell: true });
  
  // 复制必要的文件
  console.log('Copying necessary files...');
  execSync('mkdir -p dist', { stdio: 'inherit', shell: true });
  
  console.log('Build completed successfully!');
  console.log('You can now run the application with: npm start');
  console.log('Or use the CLI tool with: npx monad-payment');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}