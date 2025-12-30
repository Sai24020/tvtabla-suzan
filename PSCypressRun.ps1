# Parse command line arguments
param(
    [Parameter(HelpMessage = "Browser to use (default: chrome from module)")]
    [string]$Browser,
    
    [Parameter(HelpMessage = "Specific test file to run (optional)")]
    [string]$Spec,
    
    [Parameter(HelpMessage = "Enable Cypress Dashboard recording")]
    [switch]$Record,
    
    [Parameter(HelpMessage = "Cypress Dashboard record key (required with -Record)")]
    [string]$Key
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

# Import helper functions
Import-Module (Join-Path $PSScriptRoot 'PowerShellHelpers.psm1') -Force

# Validate parameters
if ($Record -and -not $Key) {
    Write-Error "❌ Record key (-Key) is required when using -Record switch"
    exit 1
}

# Ensure dependencies are available
Assert-Dependencies

# Validate all dependencies (git repository, Node.js, npm, Cypress)
Assert-Dependencies -ScriptName "Cypress Run Script"

# Build Cypress run arguments
$cypressArgs = @()

# Add browser if different from default (Chrome is already default in module)
if ($Browser -and $Browser -ne "chrome") {
    $cypressArgs += "--browser", $Browser
}

# Add spec file if specified
if ($Spec) {
    $cypressArgs += "--spec", $Spec
    Write-Host "📂 Running spec: $Spec" -ForegroundColor Cyan
} else {
    Write-Host "📂 Running all tests" -ForegroundColor Cyan
}

# Add recording options if specified
if ($Record -and $Key) {
    $cypressArgs += "--record", "--key", $Key
    Write-Host "� Recording enabled" -ForegroundColor Cyan
}

# Display browser info (Chrome is module default)
$displayBrowser = if ($Browser -and $Browser -ne "chrome") { $Browser } else { "chrome (default)" }
Write-Host "🌐 Browser: $displayBrowser" -ForegroundColor Cyan

# Start Cypress in headless mode (module handles student name automatically)
$exitCode = Start-CypressWithStudentName -Mode "run" -CypressArgs $cypressArgs

# Module already displays student name, just show final result
if ($exitCode -eq 0) {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "❌ Some tests failed. Exit code: $exitCode" -ForegroundColor Red
}

exit $exitCode