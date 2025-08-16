#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const incrementType = args[0] || 'mini';

// Validate increment type
const validTypes = ['big', 'mid', 'mini'];
if (!validTypes.includes(incrementType)) {
  console.error(`Error: Invalid increment type "${incrementType}". Must be one of: ${validTypes.join(', ')}`);
  process.exit(1);
}

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
let packageJson;

try {
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  packageJson = JSON.parse(packageJsonContent);
} catch (error) {
  console.error('Error reading package.json:', error.message);
  process.exit(1);
}

// Parse current version
const currentVersion = packageJson.version;
const versionParts = currentVersion.split('.').map(Number);

if (versionParts.length !== 3 || versionParts.some(isNaN)) {
  console.error(`Error: Invalid version format "${currentVersion}". Expected format: X.Y.Z`);
  process.exit(1);
}

let [major, minor, patch] = versionParts;

// Calculate new version based on increment type
function calculateNewVersion(major, minor, patch, type) {
  switch (type) {
    case 'mini': // Patch increment
      patch++;
      if (patch >= 10) {
        patch = 0;
        minor++;
        if (minor >= 10) {
          minor = 0;
          major++;
        }
      }
      break;
      
    case 'mid': // Minor increment
      minor++;
      patch = 0;
      if (minor >= 10) {
        minor = 0;
        major++;
      }
      break;
      
    case 'big': // Major increment
      major++;
      minor = 0;
      patch = 0;
      break;
  }
  
  return [major, minor, patch];
}

const [newMajor, newMinor, newPatch] = calculateNewVersion(major, minor, patch, incrementType);
const newVersion = `${newMajor}.${newMinor}.${newPatch}`;
const tagName = `v${newVersion}`;

console.log(`Current version: ${currentVersion}`);
console.log(`Increment type: ${incrementType}`);
console.log(`New version: ${newVersion}`);
console.log(`Tag name: ${tagName}`);

// Check if tag already exists
try {
  execSync(`git rev-parse ${tagName}`, { stdio: 'pipe' });
  console.error(`Error: Tag ${tagName} already exists!`);
  process.exit(1);
} catch (error) {
  // Tag doesn't exist, which is what we want
}

// Update package.json
packageJson.version = newVersion;

try {
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log('✓ Updated package.json');
} catch (error) {
  console.error('Error writing package.json:', error.message);
  process.exit(1);
}

// Git operations
try {
  // Add package.json to staging
  execSync('git add package.json', { stdio: 'inherit' });
  console.log('✓ Staged package.json');
  
  // Commit changes
  const commitMessage = `chore: bump version to ${newVersion}`;
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  console.log('✓ Committed version update');
  
  // Create annotated tag
  const tagMessage = `Release ${tagName}`;
  execSync(`git tag -a ${tagName} -m "${tagMessage}"`, { stdio: 'inherit' });
  console.log('✓ Created Git tag');
  
  console.log(`\n🎉 Successfully created release ${tagName}`);
  console.log(`\nTo trigger the CI/CD pipeline, push the tag:`);
  console.log(`git push origin ${tagName}`);
  
} catch (error) {
  console.error('Error during Git operations:', error.message);
  
  // Revert package.json changes
  try {
    packageJson.version = currentVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log('Reverted package.json changes');
  } catch (revertError) {
    console.error('Failed to revert package.json:', revertError.message);
  }
  
  process.exit(1);
}