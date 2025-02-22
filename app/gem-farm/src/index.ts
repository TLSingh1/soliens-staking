import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { GemFarmClient, RarityConfig } from "@gemworks/gem-farm-ts"; // this is the SDK folder that is on this github
import { NodeWallet } from "@metaplex/js";
import { Wallet, Idl } from "@project-serum/anchor";


const bankIdl: Idl = 
{
    "version": "0.1.0",
    "name": "gem_bank",
    "instructions": [
      {
        "name": "initBank",
        "accounts": [
          {
            "name": "bank",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "bankManager",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "payer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "setBankFlags",
        "accounts": [
          {
            "name": "bank",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "bankManager",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "flags",
            "type": "u32"
          }
        ]
      },
      {
        "name": "initVault",
        "accounts": [
          {
            "name": "bank",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "creator",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "payer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          }
        ]
      },
      {
        "name": "setVaultLock",
        "accounts": [
          {
            "name": "bank",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "bankManager",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "vaultLock",
            "type": "bool"
          }
        ]
      },
      {
        "name": "updateVaultOwner",
        "accounts": [
          {
            "name": "bank",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "newOwner",
            "type": "publicKey"
          }
        ]
      },
      {
        "name": "depositGem",
        "accounts": [
          {
            "name": "bank",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "gemBox",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "gemDepositReceipt",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "gemSource",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "gemMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "gemRarity",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "bumpAuth",
            "type": "u8"
          },
          {
            "name": "bumpGemBox",
            "type": "u8"
          },
          {
            "name": "bumpGdr",
            "type": "u8"
          },
          {
            "name": "bumpRarity",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "withdrawGem",
        "accounts": [
          {
            "name": "bank",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "gemBox",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "gemDepositReceipt",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "gemDestination",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "gemMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "gemRarity",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "receiver",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "bumpAuth",
            "type": "u8"
          },
          {
            "name": "bumpGemBox",
            "type": "u8"
          },
          {
            "name": "bumpGdr",
            "type": "u8"
          },
          {
            "name": "bumpRarity",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "addToWhitelist",
        "accounts": [
          {
            "name": "bank",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "bankManager",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "addressToWhitelist",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "whitelistProof",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "payer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "whitelistType",
            "type": "u8"
          }
        ]
      },
      {
        "name": "removeFromWhitelist",
        "accounts": [
          {
            "name": "bank",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "bankManager",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "addressToRemove",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "whitelistProof",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      },
      {
        "name": "updateBankManager",
        "accounts": [
          {
            "name": "bank",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "bankManager",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "newManager",
            "type": "publicKey"
          }
        ]
      },
      {
        "name": "recordRarityPoints",
        "accounts": [
          {
            "name": "bank",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "bankManager",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "payer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "rarityConfigs",
            "type": {
              "vec": {
                "defined": "RarityConfig"
              }
            }
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "Bank",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "version",
              "type": "u16"
            },
            {
              "name": "bankManager",
              "type": "publicKey"
            },
            {
              "name": "flags",
              "type": "u32"
            },
            {
              "name": "whitelistedCreators",
              "type": "u32"
            },
            {
              "name": "whitelistedMints",
              "type": "u32"
            },
            {
              "name": "vaultCount",
              "type": "u64"
            },
            {
              "name": "reserved",
              "type": {
                "array": [
                  "u8",
                  64
                ]
              }
            }
          ]
        }
      },
      {
        "name": "GemDepositReceipt",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "vault",
              "type": "publicKey"
            },
            {
              "name": "gemBoxAddress",
              "type": "publicKey"
            },
            {
              "name": "gemMint",
              "type": "publicKey"
            },
            {
              "name": "gemCount",
              "type": "u64"
            },
            {
              "name": "reserved",
              "type": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          ]
        }
      },
      {
        "name": "Rarity",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "points",
              "type": "u16"
            }
          ]
        }
      },
      {
        "name": "Vault",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bank",
              "type": "publicKey"
            },
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "creator",
              "type": "publicKey"
            },
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "authoritySeed",
              "type": "publicKey"
            },
            {
              "name": "authorityBumpSeed",
              "type": {
                "array": [
                  "u8",
                  1
                ]
              }
            },
            {
              "name": "locked",
              "type": "bool"
            },
            {
              "name": "name",
              "type": {
                "array": [
                  "u8",
                  32
                ]
              }
            },
            {
              "name": "gemBoxCount",
              "type": "u64"
            },
            {
              "name": "gemCount",
              "type": "u64"
            },
            {
              "name": "rarityPoints",
              "type": "u64"
            },
            {
              "name": "reserved",
              "type": {
                "array": [
                  "u8",
                  64
                ]
              }
            }
          ]
        }
      },
      {
        "name": "WhitelistProof",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "whitelistType",
              "type": "u8"
            },
            {
              "name": "whitelistedAddress",
              "type": "publicKey"
            },
            {
              "name": "bank",
              "type": "publicKey"
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "RarityConfig",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "mint",
              "type": "publicKey"
            },
            {
              "name": "rarityPoints",
              "type": "u16"
            }
          ]
        }
      }
    ]
  };

const farmIdl: Idl = {
"version": "0.1.0",
"name": "gem_farm",
"instructions": [
  {
    "name": "initFarm",
    "accounts": [
      {
        "name": "farm",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "farmManager",
        "isMut": false,
        "isSigner": true
      },
      {
        "name": "farmAuthority",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "farmTreasury",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "rewardAPot",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "rewardAMint",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "rewardBPot",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "rewardBMint",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "bank",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "gemBank",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "payer",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "feeAcc",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "rent",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "tokenProgram",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "systemProgram",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "bumpAuth",
        "type": "u8"
      },
      {
        "name": "bumpTreasury",
        "type": "u8"
      },
      {
        "name": "bumpPotA",
        "type": "u8"
      },
      {
        "name": "bumpPotB",
        "type": "u8"
      },
      {
        "name": "rewardTypeA",
        "type": {
          "defined": "RewardType"
        }
      },
      {
        "name": "rewardTypeB",
        "type": {
          "defined": "RewardType"
        }
      },
      {
        "name": "farmConfig",
        "type": {
          "defined": "FarmConfig"
        }
      }
    ]
  },
  {
    "name": "updateFarm",
    "accounts": [
      {
        "name": "farm",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "farmManager",
        "isMut": false,
        "isSigner": true
      }
    ],
    "args": [
      {
        "name": "config",
        "type": {
          "option": {
            "defined": "FarmConfig"
          }
        }
      },
      {
        "name": "manager",
        "type": {
          "option": "publicKey"
        }
      }
    ]
  },
  {
    "name": "payoutFromTreasury",
    "accounts": [
      {
        "name": "farm",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "farmManager",
        "isMut": false,
        "isSigner": true
      },
      {
        "name": "farmAuthority",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "farmTreasury",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "destination",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "systemProgram",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "bumpAuth",
        "type": "u8"
      },
      {
        "name": "bumpTreasury",
        "type": "u8"
      },
      {
        "name": "lamports",
        "type": "u64"
      }
    ]
  },
  {
    "name": "addToBankWhitelist",
    "accounts": [
      {
        "name": "farm",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "farmManager",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "farmAuthority",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "bank",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "addressToWhitelist",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "whitelistProof",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "systemProgram",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "gemBank",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "bumpAuth",
        "type": "u8"
      },
      {
        "name": "bumpWl",
        "type": "u8"
      },
      {
        "name": "whitelistType",
        "type": "u8"
      }
    ]
  },
  {
    "name": "removeFromBankWhitelist",
    "accounts": [
      {
        "name": "farm",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "farmManager",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "farmAuthority",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "bank",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "addressToRemove",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "whitelistProof",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "gemBank",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "bumpAuth",
        "type": "u8"
      },
      {
        "name": "bumpWl",
        "type": "u8"
      }
    ]
  },
  {
    "name": "initFarmer",
    "accounts": [
      {
        "name": "farm",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "farmer",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "identity",
        "isMut": false,
        "isSigner": true
      },
      {
        "name": "bank",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "vault",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "gemBank",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "payer",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "feeAcc",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "systemProgram",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "bumpFarmer",
        "type": "u8"
      },
      {
        "name": "bumpVault",
        "type": "u8"
      }
    ]
  },
  {
    "name": "stake",
    "accounts": [
      {
        "name": "farm",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "farmAuthority",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "farmer",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "identity",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "bank",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "vault",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "gemBank",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "bumpAuth",
        "type": "u8"
      },
      {
        "name": "bumpFarmer",
        "type": "u8"
      }
    ]
  },
  {
    "name": "unstake",
    "accounts": [
      {
        "name": "farm",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "farmAuthority",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "farmTreasury",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "farmer",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "identity",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "bank",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "vault",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "gemBank",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "systemProgram",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "bumpAuth",
        "type": "u8"
      },
      {
        "name": "bumpTreasury",
        "type": "u8"
      },
      {
        "name": "bumpFarmer",
        "type": "u8"
      }
    ]
  },
  {
    "name": "claim",
    "accounts": [
      {
        "name": "farm",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "farmAuthority",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "farmer",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "identity",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "rewardAPot",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "rewardAMint",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "rewardADestination",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "rewardBPot",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "rewardBMint",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "rewardBDestination",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "tokenProgram",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "associatedTokenProgram",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "systemProgram",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "rent",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "bumpAuth",
        "type": "u8"
      },
      {
        "name": "bumpFarmer",
        "type": "u8"
      },
      {
        "name": "bumpPotA",
        "type": "u8"
      },
      {
        "name": "bumpPotB",
        "type": "u8"
      }
    ]
  },
  {
    "name": "flashDeposit",
    "accounts": [
      {
        "name": "farm",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "farmAuthority",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "farmer",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "identity",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "bank",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "vault",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "vaultAuthority",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "gemBox",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "gemDepositReceipt",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "gemSource",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "gemMint",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "gemRarity",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "tokenProgram",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "systemProgram",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "rent",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "gemBank",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "bumpFarmer",
        "type": "u8"
      },
      {
        "name": "bumpVaultAuth",
        "type": "u8"
      },
      {
        "name": "bumpGemBox",
        "type": "u8"
      },
      {
        "name": "bumpGdr",
        "type": "u8"
      },
      {
        "name": "bumpRarity",
        "type": "u8"
      },
      {
        "name": "amount",
        "type": "u64"
      }
    ]
  },
  {
    "name": "refreshFarmer",
    "accounts": [
      {
        "name": "farm",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "farmer",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "identity",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "bump",
        "type": "u8"
      }
    ]
  },
  {
    "name": "refreshFarmerSigned",
    "accounts": [
      {
        "name": "farm",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "farmer",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "identity",
        "isMut": false,
        "isSigner": true
      }
    ],
    "args": [
      {
        "name": "bump",
        "type": "u8"
      },
      {
        "name": "reenroll",
        "type": "bool"
      }
    ]
  },
  {
    "name": "authorizeFunder",
    "accounts": [
      {
        "name": "farm",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "farmManager",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "funderToAuthorize",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "authorizationProof",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "systemProgram",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "bump",
        "type": "u8"
      }
    ]
  },
  {
    "name": "deauthorizeFunder",
    "accounts": [
      {
        "name": "farm",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "farmManager",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "funderToDeauthorize",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "authorizationProof",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "systemProgram",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "bump",
        "type": "u8"
      }
    ]
  },
  {
    "name": "fundReward",
    "accounts": [
      {
        "name": "farm",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "authorizationProof",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "authorizedFunder",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "rewardPot",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "rewardSource",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "rewardMint",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "tokenProgram",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "systemProgram",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "bumpProof",
        "type": "u8"
      },
      {
        "name": "bumpPot",
        "type": "u8"
      },
      {
        "name": "variableRateConfig",
        "type": {
          "option": {
            "defined": "VariableRateConfig"
          }
        }
      },
      {
        "name": "fixedRateConfig",
        "type": {
          "option": {
            "defined": "FixedRateConfig"
          }
        }
      }
    ]
  },
  {
    "name": "cancelReward",
    "accounts": [
      {
        "name": "farm",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "farmManager",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "farmAuthority",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "rewardPot",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "rewardDestination",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "rewardMint",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "receiver",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "tokenProgram",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "associatedTokenProgram",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "systemProgram",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "rent",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "bumpAuth",
        "type": "u8"
      },
      {
        "name": "bumpPot",
        "type": "u8"
      }
    ]
  },
  {
    "name": "lockReward",
    "accounts": [
      {
        "name": "farm",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "farmManager",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "rewardMint",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": []
  },
  {
    "name": "addRaritiesToBank",
    "accounts": [
      {
        "name": "farm",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "farmManager",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "farmAuthority",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "bank",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "gemBank",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "systemProgram",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "bumpAuth",
        "type": "u8"
      },
      {
        "name": "rarityConfigs",
        "type": {
          "vec": {
            "defined": "RarityConfig"
          }
        }
      }
    ]
  }
],
"accounts": [
  {
    "name": "AuthorizationProof",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "authorizedFunder",
          "type": "publicKey"
        },
        {
          "name": "farm",
          "type": "publicKey"
        },
        {
          "name": "reserved",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  },
  {
    "name": "Farm",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "version",
          "type": "u16"
        },
        {
          "name": "farmManager",
          "type": "publicKey"
        },
        {
          "name": "farmTreasury",
          "type": "publicKey"
        },
        {
          "name": "farmAuthority",
          "type": "publicKey"
        },
        {
          "name": "farmAuthoritySeed",
          "type": "publicKey"
        },
        {
          "name": "farmAuthorityBumpSeed",
          "type": {
            "array": [
              "u8",
              1
            ]
          }
        },
        {
          "name": "bank",
          "type": "publicKey"
        },
        {
          "name": "config",
          "type": {
            "defined": "FarmConfig"
          }
        },
        {
          "name": "farmerCount",
          "type": "u64"
        },
        {
          "name": "stakedFarmerCount",
          "type": "u64"
        },
        {
          "name": "gemsStaked",
          "type": "u64"
        },
        {
          "name": "rarityPointsStaked",
          "type": "u64"
        },
        {
          "name": "authorizedFunderCount",
          "type": "u64"
        },
        {
          "name": "rewardA",
          "type": {
            "defined": "FarmReward"
          }
        },
        {
          "name": "rewardB",
          "type": {
            "defined": "FarmReward"
          }
        },
        {
          "name": "reserved",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    }
  },
  {
    "name": "Farmer",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "farm",
          "type": "publicKey"
        },
        {
          "name": "identity",
          "type": "publicKey"
        },
        {
          "name": "vault",
          "type": "publicKey"
        },
        {
          "name": "state",
          "type": {
            "defined": "FarmerState"
          }
        },
        {
          "name": "gemsStaked",
          "type": "u64"
        },
        {
          "name": "rarityPointsStaked",
          "type": "u64"
        },
        {
          "name": "minStakingEndsTs",
          "type": "u64"
        },
        {
          "name": "cooldownEndsTs",
          "type": "u64"
        },
        {
          "name": "rewardA",
          "type": {
            "defined": "FarmerReward"
          }
        },
        {
          "name": "rewardB",
          "type": {
            "defined": "FarmerReward"
          }
        },
        {
          "name": "reserved",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  }
],
"types": [
  {
    "name": "FarmConfig",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "minStakingPeriodSec",
          "type": "u64"
        },
        {
          "name": "cooldownPeriodSec",
          "type": "u64"
        },
        {
          "name": "unstakingFeeLamp",
          "type": "u64"
        }
      ]
    }
  },
  {
    "name": "FundsTracker",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "totalFunded",
          "type": "u64"
        },
        {
          "name": "totalRefunded",
          "type": "u64"
        },
        {
          "name": "totalAccruedToStakers",
          "type": "u64"
        }
      ]
    }
  },
  {
    "name": "TimeTracker",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "durationSec",
          "type": "u64"
        },
        {
          "name": "rewardEndTs",
          "type": "u64"
        },
        {
          "name": "lockEndTs",
          "type": "u64"
        }
      ]
    }
  },
  {
    "name": "FarmReward",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "rewardMint",
          "type": "publicKey"
        },
        {
          "name": "rewardPot",
          "type": "publicKey"
        },
        {
          "name": "rewardType",
          "type": {
            "defined": "RewardType"
          }
        },
        {
          "name": "fixedRate",
          "type": {
            "defined": "FixedRateReward"
          }
        },
        {
          "name": "variableRate",
          "type": {
            "defined": "VariableRateReward"
          }
        },
        {
          "name": "funds",
          "type": {
            "defined": "FundsTracker"
          }
        },
        {
          "name": "times",
          "type": {
            "defined": "TimeTracker"
          }
        },
        {
          "name": "reserved",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  },
  {
    "name": "FarmerReward",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "paidOutReward",
          "type": "u64"
        },
        {
          "name": "accruedReward",
          "type": "u64"
        },
        {
          "name": "variableRate",
          "type": {
            "defined": "FarmerVariableRateReward"
          }
        },
        {
          "name": "fixedRate",
          "type": {
            "defined": "FarmerFixedRateReward"
          }
        },
        {
          "name": "reserved",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  },
  {
    "name": "FarmerVariableRateReward",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "lastRecordedAccruedRewardPerRarityPoint",
          "type": {
            "defined": "Number128"
          }
        },
        {
          "name": "reserved",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        }
      ]
    }
  },
  {
    "name": "FarmerFixedRateReward",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "beginStakingTs",
          "type": "u64"
        },
        {
          "name": "beginScheduleTs",
          "type": "u64"
        },
        {
          "name": "lastUpdatedTs",
          "type": "u64"
        },
        {
          "name": "promisedSchedule",
          "type": {
            "defined": "FixedRateSchedule"
          }
        },
        {
          "name": "promisedDuration",
          "type": "u64"
        },
        {
          "name": "reserved",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        }
      ]
    }
  },
  {
    "name": "TierConfig",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "rewardRate",
          "type": "u64"
        },
        {
          "name": "requiredTenure",
          "type": "u64"
        }
      ]
    }
  },
  {
    "name": "FixedRateSchedule",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "baseRate",
          "type": "u64"
        },
        {
          "name": "tier1",
          "type": {
            "option": {
              "defined": "TierConfig"
            }
          }
        },
        {
          "name": "tier2",
          "type": {
            "option": {
              "defined": "TierConfig"
            }
          }
        },
        {
          "name": "tier3",
          "type": {
            "option": {
              "defined": "TierConfig"
            }
          }
        },
        {
          "name": "denominator",
          "type": "u64"
        }
      ]
    }
  },
  {
    "name": "FixedRateConfig",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "schedule",
          "type": {
            "defined": "FixedRateSchedule"
          }
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "durationSec",
          "type": "u64"
        }
      ]
    }
  },
  {
    "name": "FixedRateReward",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "schedule",
          "type": {
            "defined": "FixedRateSchedule"
          }
        },
        {
          "name": "reservedAmount",
          "type": "u64"
        },
        {
          "name": "reserved",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  },
  {
    "name": "RarityConfig",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "mint",
          "type": "publicKey"
        },
        {
          "name": "rarityPoints",
          "type": "u16"
        }
      ]
    }
  },
  {
    "name": "Number128",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "n",
          "type": "u128"
        }
      ]
    }
  },
  {
    "name": "VariableRateConfig",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "durationSec",
          "type": "u64"
        }
      ]
    }
  },
  {
    "name": "VariableRateReward",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "rewardRate",
          "type": {
            "defined": "Number128"
          }
        },
        {
          "name": "rewardLastUpdatedTs",
          "type": "u64"
        },
        {
          "name": "accruedRewardPerRarityPoint",
          "type": {
            "defined": "Number128"
          }
        },
        {
          "name": "reserved",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  },
  {
    "name": "RewardType",
    "type": {
      "kind": "enum",
      "variants": [
        {
          "name": "Variable"
        },
        {
          "name": "Fixed"
        }
      ]
    }
  },
  {
    "name": "FarmerState",
    "type": {
      "kind": "enum",
      "variants": [
        {
          "name": "Unstaked"
        },
        {
          "name": "Staked"
        },
        {
          "name": "PendingCooldown"
        }
      ]
    }
  },
  {
    "name": "FixedRateRewardTier",
    "type": {
      "kind": "enum",
      "variants": [
        {
          "name": "Base"
        },
        {
          "name": "Tier1"
        },
        {
          "name": "Tier2"
        },
        {
          "name": "Tier3"
        }
      ]
    }
  }
]
};
const farmProgId = new PublicKey("bankHHdqMuaaST4qQk6mkzxGeKPHWmqdgor6Gs8r88m");
const bankProgId = new PublicKey('farmL4xeBFVXJqtfxCzU9b28QACM7E2W2ctT6epAjvE');
const farmId = new PublicKey("28JPaxN9f6rw2hHS8Ast1EgDh6cK5uQwHzfWfjsAtrPD");



(async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // This keypair needs to be the farm manager
  const manager = Keypair.fromSecretKey(
    Uint8Array.from(
      // Wallet private key here
      [111,246,43,104,128,135,135,104,84,89,122,184,68,163,105,173,205,151,176,55,165,36,115,117,243,228,11,44,109,236,50,141,196,113,174,218,135,100,125,86,62,123,197,214,75,229,193,145,68,174,20,25,174,180,68,114,248,193,12,23,154,121,224,73]
    )
  );

  let gf = new GemFarmClient(
    connection,
    new NodeWallet(manager) as typeof Wallet,
    farmIdl as any,
    farmProgId,
    bankIdl as any,
    bankProgId
  );

  const farm = await gf.fetchFarmAcc(farmId);
  console.log(farm);

  // This is the rarity array that you configure, each object consists of the
  // NFT mint address and the rarity points associated with it.
  const rarities: RarityConfig[] = [
    {
      mint: new PublicKey("13Yrq7Zi3A41jrgHa3oc29o9aS51mvrp39Egxfn7iCZm"), // The NFT address
      rarityPoints: 1, // < this is the rarity multiplier
    },
    // It's an array, you can put as many rarity configurations as you want
  ];

  // This executes the transaction to apply the rarities
  const { txSig } = await gf.addRaritiesToBank(
    farmId,
    manager,
    rarities
  );
  console.log(txSig);

  // You can retrieve it this way to check if it has been stored correctly
  const [rarityAddr] = await gf.findRarityPDA(
    farm.bank,
    new PublicKey("13Yrq7Zi3A41jrgHa3oc29o9aS51mvrp39Egxfn7iCZm")
  );

  const rarityAcc = await gf.fetchRarity(rarityAddr);
  console.log(rarityAcc);
})();