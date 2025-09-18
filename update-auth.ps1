$files = Get-ChildItem -Path "C:\Users\jledesma\Desktop\efa_2" -Recurse -Include *.tsx | Where-Object { $_.FullName -notlike "*\node_modules\*" }

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Replace import statements
    $content = $content -replace 'import { useAuth } from "@/context/AuthContext";', 'import { useApp } from "@/context/AppContext";'
    $content = $content -replace 'import AuthContext from "@/context/AuthContext";', 'import AppContext from "@/context/AppContext";'
    
    # Replace useAuth() hook usage
    $content = $content -replace 'useAuth\(\)', 'useApp()'
    
    # Replace useContext(AuthContext)
    $content = $content -replace 'useContext\(AuthContext\)', 'useContext(AppContext)'
    
    # Replace AuthProvider reference
    $content = $content -replace 'import { AuthProvider } from "@/context/AuthContext";', 'import { AppProvider } from "@/context/AppContext";'
    $content = $content -replace '<AuthProvider>', '<AppProvider>'
    $content = $content -replace '</AuthProvider>', '</AppProvider>'
    
    Set-Content -Path $file.FullName -Value $content
}

Write-Host "Replacements completed."