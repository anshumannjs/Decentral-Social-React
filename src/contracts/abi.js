export const SOCIAL_MEDIA_ABI = [
  {
    "type": "function",
    "name": "createPost",
    "inputs": [
      {
        "name": "_contentUri",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deletePost",
    "inputs": [
      {
        "name": "_id",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "dislikePost",
    "inputs": [
      {
        "name": "_id",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "fetchFollowingPosts",
    "inputs": [
      {
        "name": "page",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "limit",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "fetchGlobalPosts",
    "inputs": [
      {
        "name": "page",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "limit",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "follow",
    "inputs": [
      {
        "name": "_userAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getFollowers",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getFollowing",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getInteractionType",
    "inputs": [
      {
        "name": "_id",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPostDetails",
    "inputs": [
      {
        "name": "_id",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getReputationScore",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserPosts",
    "inputs": [
      {
        "name": "_userAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserProfile",
    "inputs": [
      {
        "name": "_userAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isFollowing",
    "inputs": [
      {
        "name": "_userAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "likePost",
    "inputs": [
      {
        "name": "_id",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "register",
    "inputs": [
      {
        "name": "_username",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_bio",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "reportPost",
    "inputs": [
      {
        "name": "_id",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "unfollow",
    "inputs": [
      {
        "name": "_userAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateBio",
    "inputs": [
      {
        "name": "_bio",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updatePost",
    "inputs": [
      {
        "name": "_contentUri",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_id",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateUserName",
    "inputs": [
      {
        "name": "_username",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "BioUpdated",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newBio",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Followed",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "toBeFollowedAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PostCreated",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "postId",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PostDeleted",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "postId",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PostDisliked",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "postId",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PostLiked",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "postId",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PostReported",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "postId",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PostUpdated",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "postId",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ProfileRegistered",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "username",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "newBio",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Unfollowed",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "toBeUnfollowedAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UserNameUpdated",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newUserName",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "alreadyDislikedPost",
    "inputs": [
      {
        "name": "author",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "postId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "alreadyFollowing",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "toBeFollowedAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "alreadyLikedPost",
    "inputs": [
      {
        "name": "author",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "postId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "alreadyReportedPost",
    "inputs": [
      {
        "name": "author",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "postId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "canNotFollowYourself",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "canNotUnFollowYourself",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "canNotUpdatePostThatHasUserInteraction",
    "inputs": [
      {
        "name": "postId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "notFollowing",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "toBeUnfollowedAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "postNotFound",
    "inputs": [
      {
        "name": "postId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "senderIsNotAuthorOfPost",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "authorOfPost",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "postId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "userAlreadyRegistered",
    "inputs": [
      {
        "name": "author",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "userNotRegistered",
    "inputs": [
      {
        "name": "author",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "usernameExists",
    "inputs": [
      {
        "name": "username",
        "type": "string",
        "internalType": "string"
      }
    ]
  }
];