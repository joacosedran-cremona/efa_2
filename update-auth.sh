#!/bin/bash

# Script to replace AuthContext imports with AppContext

# Define search and replacement patterns
find_pattern="import { useAuth } from \"@/context/AuthContext\";"
replace_pattern="import { useApp } from \"@/context/AppContext\";"

find_pattern2="import AuthContext from \"@/context/AuthContext\";"
replace_pattern2="import AppContext from \"@/context/AppContext\";"

find_pattern3="useAuth();"
replace_pattern3="useApp();"

find_pattern4="useContext(AuthContext)"
replace_pattern4="useContext(AppContext)"

# Find all TypeScript and TSX files that contain the search pattern and replace it
find c:/Users/jledesma/Desktop/efa_2 -name "*.tsx" | xargs sed -i -e "s/$find_pattern/$replace_pattern/g" -e "s/$find_pattern2/$replace_pattern2/g" -e "s/$find_pattern3/$replace_pattern3/g" -e "s/$find_pattern4/$replace_pattern4/g"

echo "Replacements completed."