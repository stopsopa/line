
ROOT="$(pwd)"
FILE="${ROOT}/libs/line.entry.js"
WATCHC="0"
STATUS="0"
while [ "${STATUS}" = "0" ]; do
    WATCHC="$((WATCHC + 1))"
    until [ -f "${FILE}" ]
    do
        echo "${0} ${WATCHC} log: waiting for ${FILE} to be created"
        sleep 1
    done
    cat package.json
    make build
    echo --- waiting ---
    node "${ROOT}/bash/fs/watch.js" "${FILE}"
    STATUS="${?}"
done