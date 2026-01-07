$backend = Start-Process -FilePath "powershell" -ArgumentList "cd backend; .\venv\Scripts\python -m uvicorn main:app --reload --port 8000" -PassThru
$frontend = Start-Process -FilePath "powershell" -ArgumentList "cd frontend; npm run dev" -PassThru

Write-Host "Started Backend (PID: $($backend.Id)) and Frontend (PID: $($frontend.Id))"
Write-Host "Please close the new terminal windows to stop the servers."
