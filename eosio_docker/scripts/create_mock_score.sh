#!/bin/bash
set -eux

echo "=== start deploy data ==="
cleos() {
    /opt/eosio/bin/cleos "$@"
}
 # cd into script's folder
cd "$(dirname "$0")"
echo "=== start create accounts in blockchain ==="

# import bobross account private key and create mock posts under bobross
#cleos wallet import -n blogwallet --private-key 5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5

# download jq for json reader, we use jq here for reading the json file ( accounts.json )
mkdir -p ~/bin && curl -sSL -o ~/bin/jq https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 && chmod +x ~/bin/jq && export PATH=$PATH:~/bin

jq -c '.[]' mock_score.json | while read i; do
    timestamp=$(jq -r '.timestamp' <<< "$i")
    user_id=$(jq -r '.user_id' <<< "$i")
    name=$(jq -r '.name' <<< "$i")
    loc_long=$(jq -r '.loc_long' <<< "$i")
    loc_lat=$(jq -r '.loc_lat' <<< "$i")
    loc_time=$(jq -r '.loc_time' <<< "$i")
    device=$(jq -r '.device' <<< "$i")
    sustainability=$(jq -r '.sustainability' <<< "$i")
    travel=$(jq -r '.travel' <<< "$i")
    on_bus=$(jq -r '.on_bus' <<< "$i")

    cleos push action \
        scoreaccount \
        createscore "[ $timestamp,  "\""bobross"\"", "\""$user_id"\"", "\""$name"\"", $loc_long, $loc_lat, $loc_time, "\""$device"\"", $sustainability, $travel, $on_bus]" \
        -p bobross@active
done
