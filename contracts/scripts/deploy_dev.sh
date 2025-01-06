#-----------------
# build
#
echo "------------------------------------------------------------------------------"
echo "Cleaning..."
sozo clean
echo "Building..."
sozo build

#-----------------
# migrate
#
echo ">>> Migrate"
sozo migrate
echo "👍"

#-----------------
# get deployed addresses
#

export MANIFEST_FILE_PATH="./manifest_dev.json"

get_contract_address () {
  local TAG=$1
  local RESULT=$(cat $MANIFEST_FILE_PATH | jq -r ".contracts[] | select(.tag == \"$TAG\" ).address")
  if [[ -z "$RESULT" ]]; then
    >&2 echo "get_contract_address($TAG) not found! 👎"
  fi
  echo $RESULT
}

export LS_TOURNAMENTS_V0_ADDRESS=$(get_contract_address "ls_tournaments_v0-tournament_mock")
export ETH_ADDRESS=$(get_contract_address "ls_tournaments_v0-eth_mock")
export LORDS_ADDRESS=$(get_contract_address "ls_tournaments_v0-lords_mock")
export LOOT_SURVIVOR_ADDRESS=$(get_contract_address "ls_tournaments_v0-loot_survivor_mock")
export ORACLE_ADDRESS=$(get_contract_address "ls_tournaments_v0-pragma_mock")
export TEST_ERC20=$(get_contract_address "ls_tournaments_v0-erc20_mock")
export TEST_ERC721=$(get_contract_address "ls_tournaments_v0-erc721_mock")

#-----------------
# initialize tournament
#
echo ">>> Initialize tournament"
echo "LS_TOURNAMENTS_V0_ADDRESS: $LS_TOURNAMENTS_V0_ADDRESS"
echo "ETH_ADDRESS: $ETH_ADDRESS"
echo "LORDS_ADDRESS: $LORDS_ADDRESS"
echo "LOOT_SURVIVOR_ADDRESS: $LOOT_SURVIVOR_ADDRESS"
echo "ORACLE_ADDRESS: $ORACLE_ADDRESS"
echo "TEST_ERC20: $TEST_ERC20"
echo "TEST_ERC721: $TEST_ERC721"

echo "Waiting 10 seconds before execution..."
sleep 10

sozo execute tournament_mock initializer --calldata $ETH_ADDRESS,$LORDS_ADDRESS,$LOOT_SURVIVOR_ADDRESS,$ORACLE_ADDRESS,$TEST_ERC721,$TEST_ERC721,0,1,$TEST_ERC20,$TEST_ERC721
sozo execute loot_survivor_mock initializer --calldata $ETH_ADDRESS,$LORDS_ADDRESS,$ORACLE_ADDRESS
sozo execute loot_survivor_mock set_free_game_available --calldata 0,1
sozo execute loot_survivor_mock set_free_game_available --calldata 1,1

#------------------
echo "--- DONE! 👍"