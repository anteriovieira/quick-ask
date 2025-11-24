const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, '../package.json');
const manifestPath = path.join(__dirname, '../manifest.json');

function bumpVersion(filePath) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const versionParts = content.version.split('.').map(Number);

    // Increment patch version
    versionParts[2] = (versionParts[2] || 0) + 1;

    const newVersion = versionParts.join('.');
    content.version = newVersion;

    fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
    return newVersion;
}

console.log('Bumping version...');

try {
    const newPackageVersion = bumpVersion(packagePath);
    console.log(`Updated package.json to version ${newPackageVersion}`);

    // Manifest version might be different or same, but we want to sync them or just bump manifest?
    // The requirement is to bump both. Let's assume we want to keep them in sync or just bump both independently.
    // Usually manifest version matches package version.
    // Let's read manifest, bump it.

    // Actually, let's just use the same logic for both to ensure they increment.
    // If they are desynced, this will keep them desynced but incremented. 
    // If we want to sync them, we should use one as source of truth.
    // Let's just bump both for now as requested.

    const newManifestVersion = bumpVersion(manifestPath);
    console.log(`Updated manifest.json to version ${newManifestVersion}`);

} catch (error) {
    console.error('Error bumping version:', error);
    process.exit(1);
}
