
Followed code to attach smart contract

cleos create wallet
PW: ”PW5K99xRW6ifRYmMzZDHkLsDejrF7wiKqvisSKBwZ6sX4Rxbzf5C7"
cleos create wallet -n locationacc
PW: ”PW5Hsj6qnHtbHxUZ3oCpdsrWjXVuPsUdTghpQt2qMaJNafUo2Mm7w"

cleos wallet import --private-key 5JwuNDT7kQbC9aErwPh6H9UaXj5WLjpsQuDUp2QskpNFSh1uehQ --name locationacc
cleos wallet import --private-key 5KWpyBi8MF5UeE6C1AnRWMpm8oURcp3GiYvALjd8JpjfvzAGQFE --name locationacc
cleos create account eosio locationacc EOS73NhA2m31YRqjvmDWJ5cnobVHDTjneXLEVX8TUbhgsprjn7R9J EOS7GH6niR5og6s6pgqqgvQPoNPK6YyKpTsAju5iCswfv2mpsNotp

eosiocpp alias:
alias eosiocpp='docker exec eosio_blog_container eosiocpp'

Build abi and wast files:
eosiocpp -o /opt/eosio/bin/contracts/location/location.wast /opt/eosio/bin/contracts/location/location.cpp

eosiocpp -g /opt/eosio/bin/contracts/location/location.abi /opt/eosio/bin/contracts/location/location.cpp

Update fn:
cleos set abi locationacc /opt/eosio/bin/contracts/location/location.abi

Set contract:
cleos set contract locationacc /opt/eosio/bin/contracts/location/ --permission locationacc@active

Set abi:
cleos push action locationacc createlocat '[123, "locationacc", 0, 0,10]' -p locationacc@active
