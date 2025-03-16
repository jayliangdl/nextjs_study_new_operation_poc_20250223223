const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

// 递归查找所有 tsx 文件
function findComponents(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findComponents(filePath, fileList);
    } else if (file.endsWith('.tsx') && !file.endsWith('.test.tsx') && !file.endsWith('.spec.tsx')) {
      // 检查文件内容是否包含 withComponentRegister
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes('withComponentRegister')) {
        const relativePath = path.relative(
          path.join(process.cwd(), 'src/components'),
          filePath
        ).replace(/\\/g, '/');
        fileList.push(relativePath);
      }
    }
  });
  
  return fileList;
}

// 生成注册文件
function generateRegistryFile(components) {
  const imports = components
    .map(comp => `import './${comp.replace('.tsx', '')}';`)
    .join('\n');

  const content = `// 此文件由脚本自动生成，请勿手动修改
// 用于自动注册所有使用 withComponentRegister 的组件
// 最后更新时间: ${new Date().toLocaleString()}

${imports}
`;

  const registryPath = path.join(process.cwd(), 'src/components/componentRegistry.generated.ts');
  
  // 检查文件是否存在且内容相同，避免不必要的写入
  if (fs.existsSync(registryPath)) {
    const existingContent = fs.readFileSync(registryPath, 'utf-8');
    if (existingContent === content) {
      return;
    }
  }

  fs.writeFileSync(registryPath, content);
  console.log('组件注册文件已更新:', new Date().toLocaleString());
}

// 执行生成
function generate() {
  const componentsDir = path.join(process.cwd(), 'src/components');
  const components = findComponents(componentsDir);
  generateRegistryFile(components);
}

// 首次生成
generate();

// 如果是开发模式，启动文件监听
if (process.argv.includes('--watch')) {
  const componentsDir = path.join(process.cwd(), 'src/components');
  console.log('正在监听组件文件变化...');
  
  const watcher = chokidar.watch('**/*.tsx', {
    cwd: componentsDir,
    ignored: /(^|[\/\\])\../, // 忽略隐藏文件
    persistent: true
  });

  watcher
    .on('add', path => {
      console.log('检测到新组件:', path);
      generate();
    })
    .on('change', path => {
      console.log('检测到组件更新:', path);
      generate();
    })
    .on('unlink', path => {
      console.log('检测到组件删除:', path);
      generate();
    });
} 