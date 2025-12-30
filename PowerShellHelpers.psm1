# PowerShell Helper Module for Cypress TV Schedule Testing
# Contains shared functions for dependency validation and Cypress execution

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Assert-Dependencies {
    <#
    .SYNOPSIS
    Validates that all required dependencies are installed and available.
    
    .PARAMETER ScriptName
    The name of the script calling this function for better error messages.
    #>
    param(
        [string]$ScriptName = "Script"
    )
    
    Write-Host "Validating dependencies for $ScriptName..." -ForegroundColor Cyan
    
    # Check if we're in a git repository
    if (-not (Test-Path ".git")) {
        Write-Host "ERROR: This project is not a git repository" -ForegroundColor Red
        Write-Host "Please run: git init" -ForegroundColor Yellow
        Write-Host "Script execution stopped." -ForegroundColor Red
        exit 1
    } else {
        Write-Host "Git repository found" -ForegroundColor Green
    }
    
    # Check if .gitignore exists and contains required entries
    $requiredGitignoreEntries = @(
        '/cypress/students',
        '/cypress/videos/',
        '/cypress/screenshots/'
    )
    
    if (-not (Test-Path ".gitignore")) {
        Write-Host "ERROR: .gitignore file not found" -ForegroundColor Red
        Write-Host "You need to add a .gitignore file to your project" -ForegroundColor Yellow
        Write-Host "The .gitignore should include these entries:" -ForegroundColor Yellow
        Write-Host "  node_modules" -ForegroundColor Green
        foreach ($entry in $requiredGitignoreEntries) {
            Write-Host "  $entry" -ForegroundColor Green
        }
        Write-Host "Script execution stopped." -ForegroundColor Red
        exit 1
    } else {
        Write-Host ".gitignore file found" -ForegroundColor Green
        
        # Read current .gitignore content
        $gitignoreContent = Get-Content ".gitignore" -ErrorAction SilentlyContinue
        $missingEntries = @()
        
        # Check for required entries
        foreach ($entry in $requiredGitignoreEntries) {
            if ($gitignoreContent -notcontains $entry) {
                $missingEntries += $entry
            }
        }
        
        # Add missing entries if any
        if ($missingEntries.Count -gt 0) {
            Write-Host "Adding missing entries to .gitignore..." -ForegroundColor Yellow
            
            # Add a comment and the missing entries
            $entriesToAdd = @()
            $entriesToAdd += ""
            $entriesToAdd += "# Cypress test files (added by PowerShell script)"
            $entriesToAdd += $missingEntries
            
            Add-Content ".gitignore" $entriesToAdd
            
            Write-Host "Added the following entries to .gitignore:" -ForegroundColor Green
            foreach ($entry in $missingEntries) {
                Write-Host "  $entry" -ForegroundColor Green
            }
        } else {
            Write-Host ".gitignore contains all required Cypress entries" -ForegroundColor Green
        }
    }
    
    # Check if Node.js is installed
    try {
        $nodeVersion = node --version 2>$null
        Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "Error: Node.js is not installed or not in PATH" -ForegroundColor Red
        Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
    
    # Check if npm is installed
    try {
        $npmVersion = npm --version 2>$null
        Write-Host "npm found: $npmVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "Error: npm is not installed or not in PATH" -ForegroundColor Red
        exit 1
    }
    
    # Check if package.json exists
    if (-not (Test-Path "package.json")) {
        Write-Host "Error: package.json not found in current directory" -ForegroundColor Red
        Write-Host "Please ensure you're in the project root directory" -ForegroundColor Yellow
        exit 1
    }
    
    # Install dependencies - use npm ci if package-lock.json exists, otherwise npm install
    if (Test-Path "package-lock.json") {
        Write-Host "Installing dependencies with 'npm ci' (using package-lock.json)..." -ForegroundColor Cyan
        npm ci
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Error: Failed to install npm dependencies with npm ci" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "No package-lock.json found, using 'npm install'..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Error: Failed to install npm dependencies" -ForegroundColor Red
            exit 1
        }
    }
    Write-Host "Dependencies installed successfully" -ForegroundColor Green
    
    # Check if Cypress is installed
    try {
        $cypressVersion = npx cypress --version 2>$null
        Write-Host "Cypress found: $cypressVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "Error: Cypress is not installed" -ForegroundColor Red
        Write-Host "Running 'npm install cypress --save-dev'..." -ForegroundColor Cyan
        npm install cypress --save-dev
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Error: Failed to install Cypress" -ForegroundColor Red
            exit 1
        }
    }
    
    # Check if git user is configured
    try {
        $gitUser = git config user.name 2>$null
        if (-not $gitUser -or $gitUser.Trim() -eq "") {
            Write-Host "Warning: Git user name not configured" -ForegroundColor Yellow
            Write-Host "Please configure git user name: git config user.name 'Your Name'" -ForegroundColor Yellow
        } else {
            Write-Host "Git user found: $gitUser" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Warning: Could not check git user configuration" -ForegroundColor Yellow
    }
    
    Write-Host "All dependencies validated successfully!" -ForegroundColor Green
}

function Get-StudentName {
    <#
    .SYNOPSIS
    Gets the student name from git configuration or prompts for it.
    
    .DESCRIPTION
    Attempts to retrieve the student name from git user.name configuration.
    If not found, prompts the user to enter their name and optionally saves it to git config.
    #>
    
    # Try to get name from git config
    try {
        $gitName = git config user.name 2>$null
        if ($gitName -and $gitName.Trim() -ne "") {
            Write-Host "Using git configured name: $gitName" -ForegroundColor Green
            return $gitName.Trim()
        }
    }
    catch {
        Write-Host "Could not retrieve git user name" -ForegroundColor Yellow
    }
    
    # Prompt for name if not found in git config
    Write-Host "Git user name not configured." -ForegroundColor Yellow
    $studentName = Read-Host "Please enter your name for test identification"
    
    if ($studentName -and $studentName.Trim() -ne "") {
        $saveToGit = Read-Host "Would you like to save this name to git config? (y/n)"
        if ($saveToGit -eq 'y' -or $saveToGit -eq 'Y') {
            try {
                git config user.name "$($studentName.Trim())"
                Write-Host "Name saved to git config successfully!" -ForegroundColor Green
            }
            catch {
                Write-Host "Warning: Could not save name to git config" -ForegroundColor Yellow
            }
        }
        return $studentName.Trim()
    }
    else {
        Write-Host "Error: Student name is required" -ForegroundColor Red
        exit 1
    }
}

function Start-CypressWithStudentName {
    <#
    .SYNOPSIS
    Starts Cypress with student name identification.
    
    .PARAMETER Mode
    The Cypress mode to run: 'open' for interactive mode, 'run' for headless mode.
    
    .PARAMETER StudentName
    The student name to use for identification. If not provided, will be retrieved automatically.
    
    .PARAMETER CypressArgs
    Additional arguments to pass to Cypress command.
    #>
    param(
        [Parameter(Mandatory = $true)]
        [ValidateSet('open', 'run')]
        [string]$Mode,
        
        [string]$StudentName = "",
        
        [string[]]$CypressArgs = @()
    )
    
    # Get student name if not provided
    if ([string]::IsNullOrWhiteSpace($StudentName)) {
        $StudentName = Get-StudentName
    }
    
    Write-Host "Starting Cypress tests for student: $StudentName" -ForegroundColor Cyan
    
    # Set environment variable for student identification
    $env:CYPRESS_STUDENT_NAME = $StudentName
    
    # Start Cypress in the specified mode
    if ($Mode -eq 'open') {
        Write-Host "Opening Cypress Test Runner in Chrome..." -ForegroundColor Green
        Write-Host ""
        Write-Host "Select and run E2E Testing in the Cypress window manually" -ForegroundColor Yellow
        
        # Show appropriate exit command based on OS
        if ($IsMacOS) {
            Write-Host "Press Cmd+C to exit when done" -ForegroundColor Gray
        } else {
            Write-Host "Press Ctrl+C to exit when done" -ForegroundColor Gray
        }
        
        Write-Host ""
        npx cypress open --browser chrome
        # For open mode, don't return exit code - just run and exit normally
    }
    else {
        Write-Host "Running Cypress tests in headless mode with Chrome..." -ForegroundColor Green
        if ($CypressArgs -and $CypressArgs.Count -gt 0) {
            $argString = $CypressArgs -join ' '
            npx cypress run --browser chrome $argString
        } else {
            npx cypress run --browser chrome
        }
        # For run mode, return the Cypress exit code
        return $LASTEXITCODE
    }
}
function Test-NodeInstalled {
    <#
    .SYNOPSIS
    Tests if Node.js is installed.
    
    .OUTPUTS
    [bool] True if Node.js is installed, otherwise False.
    #>
    try {
        node --version > $null 2>&1
        return $true
    }
    catch {
        return $false
    }
}

function Test-NpmInstalled {
    <#
    .SYNOPSIS
    Tests if npm is installed.
    
    .OUTPUTS
    [bool] True if npm is installed, otherwise False.
    #>
    try {
        npm --version > $null 2>&1
        return $true
    }
    catch {
        return $false
    }
}

function Test-CypressInstalled {
    <#
    .SYNOPSIS
    Tests if Cypress is installed locally in the project.
    
    .OUTPUTS
    [bool] True if Cypress is installed, otherwise False.
    #>
    try {
        npx cypress --version > $null 2>&1
        return $true
    }
    catch {
        return $false
    }
}

function Test-GitRepository {
    <#
    .SYNOPSIS
    Tests if the current directory is a git repository.
    
    .OUTPUTS
    [bool] True if in a git repository, otherwise False.
    #>
    try {
        git rev-parse --is-inside-work-tree > $null 2>&1
        return $true
    }
    catch {
        return $false
    }
}

function Get-GitUsername {
    <#
    .SYNOPSIS
    Retrieves the git configured user name.
    
    .OUTPUTS
    [string] The git user name.
    
    .THROWS
    If git is not configured with a user name.
    #>
    try {
        $gitName = git config user.name 2>$null
        if ($gitName -and $gitName.Trim() -ne "") {
            return $gitName.Trim()
        } else {
            throw "Git user.name is not configured."
        }
    }
    catch {
        throw "Could not retrieve git user name: $($_.Exception.Message)"
    }
}

function Test-StudentReadyForSubmission {
    <#
    .SYNOPSIS
    Checks if a student is ready for submission based on latest test results.
    
    .DESCRIPTION
    Analyzes the student's latest test report to determine if they meet 
    the requirements for submission. Returns CI-compatible status.
    
    .PARAMETER StudentName
    The student's name/username to check. If not provided, uses git username.
    
    .EXAMPLE
    Test-StudentReadyForSubmission
    Test-StudentReadyForSubmission -StudentName "benjaminosterlund"
    #>
    param(
        [Parameter()]
        [string]$StudentName
    )
    
    if (-not $StudentName) {
        $StudentName = Get-StudentName
    }
    
    $reportPath = Join-Path "cypress" "students" "$StudentName.json"
    $ciReportPath = Join-Path "cypress" "students" "${StudentName}_ci_report.json"
    
    if (-not (Test-Path $reportPath)) {
        Write-Warning "❌ No test report found for $StudentName. Run tests first."
        return $false
    }
    
    try {
        $report = Get-Content $reportPath | ConvertFrom-Json
        
        # Check if CI report exists for more detailed info
        $ciReport = $null
        if (Test-Path $ciReportPath) {
            $ciReport = Get-Content $ciReportPath | ConvertFrom-Json
        }
        
        Write-Host "📊 Test Report for $StudentName" -ForegroundColor Cyan
        Write-Host "================================" -ForegroundColor Cyan
        
        if ($ciReport) {
            Write-Host "🎯 Final Grade: " -NoNewline -ForegroundColor White
            switch ($ciReport.finalGrade) {
                "VG" { Write-Host "VG (Väl Godkänd)" -ForegroundColor Green }
                "G"  { Write-Host "G (Godkänd)" -ForegroundColor Yellow }
                "IG" { Write-Host "IG (Icke Godkänd)" -ForegroundColor Red }
            }
            
            Write-Host "📈 Test Results: $($ciReport.testSummary.passed)/$($ciReport.testSummary.total) passed ($($ciReport.testSummary.passRate)%)" -ForegroundColor White
            Write-Host "📚 G Requirements: $($ciReport.gradeBreakdown.G.passed)/$($ciReport.gradeBreakdown.G.total)" -ForegroundColor White
            Write-Host "⭐ VG Requirements: $($ciReport.gradeBreakdown.VG.passed)/$($ciReport.gradeBreakdown.VG.total)" -ForegroundColor White
            Write-Host "🕒 Last Updated: $($ciReport.timestamp)" -ForegroundColor Gray
            Write-Host ""
            Write-Host $ciReport.ciRecommendation -ForegroundColor $(if ($ciReport.readyForSubmission) { "Green" } else { "Red" })
            
            # Set exit code for CI/CD
            if ($ciReport.readyForSubmission) {
                $env:CYPRESS_READY_FOR_SUBMISSION = "true"
                $env:CYPRESS_FINAL_GRADE = $ciReport.finalGrade
                return $true
            } else {
                $env:CYPRESS_READY_FOR_SUBMISSION = "false"
                $env:CYPRESS_FINAL_GRADE = $ciReport.finalGrade
                return $false
            }
        } else {
            # Fallback to basic report analysis
            $grade = $report.grade
            Write-Host "🎯 Current Grade: $grade" -ForegroundColor $(if ($grade -eq "IG") { "Red" } elseif ($grade -eq "G") { "Yellow" } else { "Green" })
            
            $readyForSubmission = $grade -ne "IG"
            $env:CYPRESS_READY_FOR_SUBMISSION = if ($readyForSubmission) { "true" } else { "false" }
            $env:CYPRESS_FINAL_GRADE = $grade
            
            if ($readyForSubmission) {
                Write-Host "✅ Student is ready for submission!" -ForegroundColor Green
            } else {
                Write-Host "❌ Student needs more work before submission." -ForegroundColor Red
            }
            
            return $readyForSubmission
        }
    }
    catch {
        Write-Error "❌ Error reading test report: $($_.Exception.Message)"
        return $false
    }
}

function Start-CypressCI {
    <#
    .SYNOPSIS
    Runs Cypress tests in CI mode and generates submission readiness report.
    
    .DESCRIPTION
    Executes Cypress tests headlessly and automatically checks if the student
    is ready for submission. Perfect for CI/CD pipelines.
    
    .PARAMETER StudentName
    The student's name/username. If not provided, uses git username.
    
    .EXAMPLE
    Start-CypressCI
    Start-CypressCI -StudentName "benjaminosterlund"
    #>
    param(
        [Parameter()]
        [string]$StudentName
    )
    
    Write-Host "🚀 Starting Cypress CI Pipeline" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    
    # Run tests
    $exitCode = Start-CypressWithStudentName -Mode "run" -StudentName $StudentName
    
    # Check submission readiness
    Write-Host ""
    $readyForSubmission = Test-StudentReadyForSubmission -StudentName $StudentName
    
    # Set final exit code
    if ($readyForSubmission) {
        Write-Host ""
        Write-Host "🎉 CI Pipeline: SUCCESS - Ready for submission!" -ForegroundColor Green
        exit 0
    } else {
        Write-Host ""
        Write-Host "⚠️  CI Pipeline: PENDING - More work needed" -ForegroundColor Yellow
        exit 1
    }
}

# Export all functions for use by importing scripts
Export-ModuleMember -Function Assert-Dependencies, Get-StudentName, Start-CypressWithStudentName, Test-NodeInstalled, Test-NpmInstalled, Test-CypressInstalled, Test-GitRepository, Get-GitUsername, Test-StudentReadyForSubmission, Start-CypressCI

# End of PowerShellHelpers.psm1

