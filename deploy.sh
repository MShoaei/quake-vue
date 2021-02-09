#! /bin/bash
npm run build
tar czf release.tar.gz dist
scp release.tar.gz HITECH:/home/pi/quake-vue
rm -r dist
rm release.tar.gz