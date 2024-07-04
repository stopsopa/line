

yarn:
	/bin/bash swap.sh -- yarn install

tsc:
	npx tsc #  --showConfig

build:
	/bin/bash swap.sh -- node node_modules/.bin/esbuild libs/line.entry.js --bundle --outfile=dist/line.bundle.js --format=iife --loader:.js=js

watch: 
	/bin/bash watch.sh

server:
	export PPORT="5090" && echo -e "\n    http://localhost:${PPORT} \n" && python3 -m http.server ${PPORT}