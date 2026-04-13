#!/usr/bin/env node

import { execSync } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';

console.log('Building Monad Agentic Payment system...');
console.log(`Current platform: ${os.platform()}`);

try {
  // 清理之前的构建
  console.log('Cleaning previous build...');
  const distDir = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }

  // 编译 TypeScript
  console.log('Compiling TypeScript...');
  execSync('npx tsc -p tsconfig.cli.json', { stdio: 'inherit', shell: true });

  // 确保 dist 目录存在
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  console.log('Build completed successfully!');
  console.log('You can now run the application with: npm start');
  console.log('Or use the CLI tool with: npx monad-payment');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
