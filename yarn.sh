
set -e

if [ "${SWAPPED}" = "" ]; then
    export SWAPPED=true
    /bin/bash bash/swap-files-v2.sh package.json package.dev.json -- /bin/bash yarn.sh $@
    exit 0
fi


yarn add esbuild

# node node_modules/.bin/esbuild --bundle --outfile=uint8-to-b64.js --format=iife --loader=js