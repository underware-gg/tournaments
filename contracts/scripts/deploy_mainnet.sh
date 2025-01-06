# export STARKNET_RPC_URL="https://api.cartridge.gg/x/starknet/mainnet"
# export DOJO_ACCOUNT_ADDRESS="0x01aebEB03D574e1B6c1c6D4E988b3cc3914705dE9Ec76B62D49967F26e616d4e"
# export DOJO_PRIVATE_KEY="0x0021e02e9695d5409ec434af029d3465c7097933923d91d56eb367b2393dcbe3"

# #-----------------
# # build
# echo "------------------------------------------------------------------------------"
# echo "Cleaning..."
# sozo clean --profile mainnet
# echo "Building..."
# # sozo -P $PROFILE build --typescript
# sozo build --profile mainnet

# #-----------------
# # migrate
# #
# echo ">>> Migrate"
# sozo migrate --profile mainnet --fee eth
# echo "Migrated 👍"

export MANIFEST_FILE_PATH="./manifest_mainnet.json"

get_contract_address () {
  local TAG=$1
  local RESULT=$(cat $MANIFEST_FILE_PATH | jq -r ".contracts[] | select(.tag == \"$TAG\" ).address")
  if [[ -z "$RESULT" ]]; then
    >&2 echo "get_contract_address($TAG) not found! 👎"
  fi
  echo $RESULT
}

export LS_TOURNAMENTS_V0_ADDRESS=$(get_contract_address "ls_tournaments_v0-LSTournament")

#-----------------
# print tournament contracts
#
echo ">>> Tournament contracts"
echo "LS_TOURNAMENTS_V0_ADDRESS: $LS_TOURNAMENTS_V0_ADDRESS"

# #-----------------
# # approve tokens
# #
# echo ">>> Approve tokens for registration"
# starkli invoke --watch $ETH_ADDRESS approve $TOURNAMENT_ADDRESS 1 0 --account $STARKNET_ACCOUNT --private-key $PRIVATE_KEY --max-fee 0.01 2>/dev/null
# starkli invoke --watch $LORDS_ADDRESS approve $TOURNAMENT_ADDRESS 1 0 --account $STARKNET_ACCOUNT --private-key $PRIVATE_KEY --max-fee 0.01 2>/dev/null
# starkli invoke --watch $LOOT_SURVIVOR_ADDRESS approve $TOURNAMENT_ADDRESS 1 0 --account $STARKNET_ACCOUNT --private-key $PRIVATE_KEY --max-fee 0.01 2>/dev/null
# echo "Approved tokens 👍"

# #-----------------
# # register tokens
# #
# echo ">>> Register tokens"
# sozo execute ls_tournament register_tokens --calldata 3,$ETH_ADDRESS,0,1,$LORDS_ADDRESS,0,1,$LOOT_SURVIVOR_ADDRESS,1,99
# echo "Registered tokens 👍"

#------------------
echo "--- DONE! 👍"