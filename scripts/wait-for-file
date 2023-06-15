#!/usr/bin/env bash
#
# Waits for a file to exist
#
# Usage: wait-for-file FILE [TIMEOUT_SECONDS=30]

file=$1
timeout=${2:-60}

[ -f "$file" ] && exit 0

SECONDS=0

until [ -f "${file}" ] || (( SECONDS >= timeout ))
do
  dots=$(printf '%*s' $SECONDS | tr ' ' ".")
  echo -ne "\r${dots}"
  sleep 1
done

echo
[ -s "${file}" ] || exit 1
