#!/usr/bin/env node
import { execSync } from 'node:child_process';
import process from 'node:process';

const requiredLibraries = [
  'libnss3.so',
  'libatk-1.0.so.0',
  'libatk-bridge-2.0.so.0',
  'libgtk-3.so.0',
  'libasound.so.2'
];

const optionalLibraries = [
  {
    name: 'libxss.so.1',
    reason:
      'This library is only needed by some Electron builds/distributions. Missing it should not block local development.'
  }
];

function commandExists(command) {
  try {
    execSync(`command -v ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function hasLibraryViaLdconfig(libraryName) {
  try {
    const output = execSync('ldconfig -p', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return output.includes(libraryName);
  } catch {
    return null;
  }
}

function hasLibraryViaFind(libraryName) {
  try {
    execSync(`find /lib /usr/lib -name '${libraryName}' -print -quit | grep -q .`, {
      stdio: 'ignore'
    });
    return true;
  } catch {
    return false;
  }
}

function checkLibrary(libraryName) {
  if (commandExists('ldconfig')) {
    const result = hasLibraryViaLdconfig(libraryName);
    if (result !== null) {
      return result;
    }
  }

  return hasLibraryViaFind(libraryName);
}

if (process.platform !== 'linux') {
  process.exit(0);
}

const missing = requiredLibraries.filter((library) => !checkLibrary(library));
const missingOptional = optionalLibraries.filter((library) => !checkLibrary(library.name));

if (missing.length === 0) {
  if (missingOptional.length > 0) {
    console.warn('\nOptional Electron shared libraries are missing:');
    for (const library of missingOptional) {
      console.warn(`  - ${library.name}`);
      console.warn(`    ${library.reason}`);
    }
    console.warn('Continuing because these libraries are treated as optional.\n');
  }
  process.exit(0);
}

console.error('\nElectron runtime dependency check failed.');
console.error('Missing shared libraries:');
for (const library of missing) {
  console.error(`  - ${library}`);
}
console.error('\nInstall desktop dependencies and retry. For Ubuntu/WSL, run:');
console.error('  sudo apt-get update');
console.error('  sudo apt-get install -y libnss3 libatk1.0-0t64 libatk-bridge2.0-0t64 libgtk-3-0t64 libasound2t64');
console.error('  # Older Ubuntu/Debian releases may use non-t64 package names:');
console.error('  sudo apt-get install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0 libasound2');
console.error('  # Optional: install libxss1 only if your Electron build requires it.');
console.error('  sudo apt-get install -y libxss1');
process.exit(1);

