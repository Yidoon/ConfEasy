Project: Automated Release Tag Generator

1. Objective

The primary objective of this script is to automate the creation of a Git tag for new build releases. It programmatically generates the next version number based on a specified level of change, updates the project's package.json file, and commits the new tag to the repository. This process is designed to trigger a CI/CD pipeline for building and deploying the release.

2. Workflow

Read Current Version: The script reads the current version string from the version field in package.json.

Calculate New Version: It calculates the next version number based on a command-line flag.

Update Source File: The version field in package.json is updated with the new version number.

Commit Changes: The modification to package.json is committed to Git.

Create Git Tag: A new annotated Git tag is created in the format vX.Y.Z.

3. Input Parameters

The script accepts a single, optional command-line flag to define the version increment level:

big: A major version increment.

mid: A minor version increment.

mini: A patch version increment.

Default Value: If no flag is provided, the script defaults to mini.

4. Versioning Logic

The script follows standard Semantic Versioning conventions for incrementing, with a custom carry-over rule.

mini (Patch Release)

Use Case: For backward-compatible bug fixes.

Example: v0.0.1 → v0.0.2

mid (Minor Release)

Use Case: For adding new, backward-compatible functionality.

Example: v0.0.1 → v0.1.0 (resets patch to 0)

big (Major Release)

Use Case: For making incompatible API changes.

Example: v0.0.1 → v1.0.0 (resets minor and patch to 0)

5. Special Rule: Carry-Over at 10

A custom rule ensures clean version numbers: no version segment (patch or minor) can be 10 or greater.

Logic: When incrementing a segment causes it to reach 10, it resets to 0, and the next higher segment is incremented by 1.

Example 1 (mini): The version after v0.0.9 is v0.1.0, not v0.0.10.

Example 2 (mid): The version after v0.9.0 is v1.0.0, not v0.10.0.
