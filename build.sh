
set -e

if [ "${SWAPPED}" = "" ]; then
    export SWAPPED=true
    /bin/bash bash/swap-files-v2.sh package.json package.dev.json -- /bin/bash build.sh $@
    exit 0
fi

printenv

ls -la

cat package.json

echo end

# node node_modules/.bin/esbuild --bundle --outfile=uint8-to-b64.js --format=iife --loader=js