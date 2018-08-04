#include "score.hpp"

using namespace eosio;
using std::string;

class score: public contract {
  // blog class inherits the “contract” smart contract and use its constructor below
  using contract::contract;
  public:
    // contract constructor
    explicit score(account_name self): contract(self) {}

  //@abi action
  void createscore(
    const uint64_t timestamp,
    const account_name author,
    const string user_id,
    const string & name,
    const double loc_lat,
    const double loc_long,
    const uint64_t loc_time,
    const string & device,
    const uint64_t sustainability,
    const uint64_t travel,
    const bool on_bus) {
    require_auth(author);
    uint128_t skey = static_cast < uint128_t > (author) << 64 | timestamp;
    // score_table is our multi_index
    // multi_index is how you store persistant data across actions in EOSIO
    // each action has a new action context which is a clean working memory with no prior working state from other action executions
    score_table scorestable(_self, _self); // code, scope
    // add a record to our multi_index table scorestable
    // const_iterator emplace( unit64_t payer, Lambda&& constructor )
    scorestable.emplace(author, [ & ](auto & score) {
      score.pkey = scorestable.available_primary_key();
      score.skey = skey;
      score.author = author;
    });
  }

  //@abi action
  void editscore(
    const uint64_t timestamp,
    const account_name author,
    const string user_id,
    const string & name,
    const double loc_lat,
    const double loc_long,
    const uint64_t loc_time,
    const string & device,
    const uint64_t sustainability,
    const uint64_t travel,
    const bool on_bus) {
    score_table scorestable(_self, _self);
    // get object by secondary key
    auto scores = scorestable.get_index < N(getbyskey) > ();
    uint128_t skey = static_cast < uint128_t > (author) << 64 | timestamp;
    auto score = scores.find(skey);
    eosio_assert(score != scores.end(), "Score for hash could not be found");
    // check if authorized to update score
    require_auth(score->author);
  }

  //@abi action
  void deletescore(const uint64_t timestamp,
    const account_name author) {
    score_table scorestable(_self, _self);
    auto scores = scorestable.get_index < N(getbyskey) > ();
    uint128_t skey = static_cast < uint128_t > (author) << 64 | timestamp;
    auto score = scores.find(skey);
    eosio_assert(score != scores.end(), "Score for hash could not be found");
    // check if authorized to delete score
    require_auth(score->author);
    auto toDeleteScore = scorestable.find(score->pkey);
    scorestable.erase(toDeleteScore);
  }
  private:
    // mark with @abi table so that eosiocpp will add this as a multi_index to the ABI with an index of type i64

    //@abi table scores i64
    struct score_struct {
      uint64_t pkey;
      uint64_t author;
      uint128_t skey;
      // primary key
      uint64_t primary_key() const {
        return pkey;
      }
      // secondary key
      uint128_t get_by_skey() const {
        return skey;
      }
      // call macro
      EOSLIB_SERIALIZE(score_struct, (pkey)(author)(skey))
    };
  // typedef multi_index<N(table_name), object_template_to_use, other_indices> multi_index_name;
  typedef eosio::multi_index < N(scores), score_struct,
    indexed_by < N(getbyskey), const_mem_fun < score_struct, uint128_t, & score_struct::get_by_skey >>>
    score_table;
};

EOSIO_ABI(score, (createscore)(editscore)(deletescore))
