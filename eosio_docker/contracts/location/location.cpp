#include "location.hpp"

using namespace eosio;
using std::string;

class location : public contract
{
  // location class inherits the “contract” smart contract and use its constructor below
  using contract::contract;
public:
  // contract constructor
  explicit location(account_name self) : contract(self) {}

  // mark with @abi action so that eosiocpp will add this as an action to the ABI

  //@abi action
  void createlocat(
    const uint64_t timestamp,
    const account_name author,
    // const string & user_id,
    // const string & name,
    const double loc_lat,
    const double loc_long
    // const uint64_t loc_time,
    // const string & device,
    // const uint64_t travel,
    // const bool on_bus)
    )
  {
    // check if authorized for account to sign action
    // if you are not authorized then this action will be aborted
    // and the transaction will by rolled back - any modifications will be reset
    // require_auth(author);

    uint128_t skey = static_cast<uint128_t>(author) << 64 | timestamp;
    // location_table is our multi_index
    // multi_index is how you store persistant data across actions in EOSIO
    // each action has a new action context which is a clean working memory with no prior working state from other action executions
    location_table locationstable(_self, _self); // code, scope

    // add a record to our multi_index table locationstable
    // const_iterator emplace( unit64_t payer, Lambda&& constructor )
    locationstable.emplace(author, [&](auto &location) {
      location.pkey = locationstable.available_primary_key();
      location.skey = skey;
      location.author = author;
    });
  }

  //@abi action
  // void editlocation(const uint64_t timestamp, const account_name author, const string &title, const string &content, const string &tag)
  // {
  //   location_table locationstable(_self, _self);

  //   // get object by secondary key
  //   auto locations = locationstable.get_index<N(getbyskey)>();
  //   uint128_t skey = static_cast<uint128_t>(author) << 64 | timestamp;
  //   auto location = locations.find(skey);
  //   eosio_assert(location != locations.end(), "location for hash could not be found");

  //   // check if authorized to update location
  //   require_auth(location->author);
  // }

  // //@abi action
  // void likelocation(const uint64_t timestamp, const account_name author)
  // {
  //   // do not require_auth since want to allow anyone to call

  //   location_table locationstable(_self, _self);

  //   auto locations = locationstable.get_index<N(getbyskey)>();
  //   uint128_t skey = static_cast<uint128_t>(author) << 64 | timestamp;

  //   // verify it already exists
  //   auto location = locations.find(skey);
  //   eosio_assert(location != locations.end(), "location for hash not found");
  // }

  // //@abi action
  // void deletelocation(const uint64_t timestamp, const account_name author)
  // {
  //   location_table locationstable(_self, _self);

  //   auto locations = locationstable.get_index<N(getbyskey)>();
  //   uint128_t skey = static_cast<uint128_t>(author) << 64 | timestamp;

  //   auto location = locations.find(skey);
  //   eosio_assert(location != locations.end(), "location for hash could not be found");

  //   // check if authorized to delete location
  //   require_auth(location->author);

  //   auto toDeletelocation = locationstable.find(location->pkey);
  //   locationstable.erase(toDeletelocation);
  // }

private:
  // mark with @abi table so that eosiocpp will add this as a multi_index to the ABI with an index of type i64

  //@abi table locations i64
  struct locat_struct
  {
    uint64_t pkey;
    uint64_t author;
    uint128_t skey;


    // primary key
    uint64_t primary_key() const { return pkey; }

    // secondary key
    uint128_t get_by_skey() const { return skey; }

    // call macro
    EOSLIB_SERIALIZE(locat_struct, (pkey)(author)(skey))
  };

  // typedef multi_index<N(table_name), object_template_to_use, other_indices> multi_index_name;
  typedef eosio::multi_index<N(location), locat_struct,
                      indexed_by<N(getbyskey), const_mem_fun<locat_struct, uint128_t, &locat_struct::get_by_skey>>>
      location_table;
};

EOSIO_ABI(location, (createlocat))