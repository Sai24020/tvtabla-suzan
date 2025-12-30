Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

# Import helper functions
Import-Module (Join-Path $PSScriptRoot 'PowerShellHelpers.psm1') -Force

# Validate all dependencies (git repository, Node.js, npm, Cypress)
Assert-Dependencies -ScriptName "Cypress Open Script"

# Start Cypress in interactive mode
Start-CypressWithStudentName -Mode "open"