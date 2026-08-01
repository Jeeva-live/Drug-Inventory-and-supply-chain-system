$ErrorActionPreference = "Stop"

# Navigate to the ai-model root directory
cd ..

# Check if .venv exists, if not, create it
if (!(Test-Path -Path ".venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv .venv
}

# Activate the virtual environment
Write-Host "Activating virtual environment..."
. .\.venv\Scripts\Activate.ps1

# Install requirements
Write-Host "Installing requirements..."
pip install -r requirements.txt

# Run the app
Write-Host "Starting the AI Model API..."
cd api
python app.py
