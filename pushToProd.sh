#! /bin/bash

ng build --prod

cd ../smart-cancer-navigator.github.io
find . -maxdepth 1 \! \( -name .git -o -name . -o -name .. -o -name .gitignore \) -exec rm -rf '{}' \;

cp -R ../Application/dist/. .

git add .
git commit -m "Auto Update"
git push
