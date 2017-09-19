#! /bin/bash

ng build

cd ../Releases
find . -maxdepth 1 \! \( -name .git -o -name temp \) -exec rm -rf '{}' \;

cp -R ../Application/dist/. .

git add .
git commit -m "Auto Update"
git push
