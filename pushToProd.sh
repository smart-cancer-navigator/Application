#! /bin/bash

ng build --prod

cd ../Production
find . -maxdepth 1 \! \( -name .git -o -name temp \) -exec rm -rf '{}' \;

cp -R ../Development/dist/. .

git add .
git commit -m "Auto Update"
git push
