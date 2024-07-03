# 
# use:
# /bin/bash swap.sh -- yarn list
# 

set -e

if [ "${SWAPPED}" = "" ]; then
    export SWAPPED=true
    shift;
    /bin/bash bash/swap-files-v2.sh package.json package.dev.json -- /bin/bash swap.sh $@
    exit 0
fi

cat <<EEE
${0} executing >${@}<

EEE

eval $@