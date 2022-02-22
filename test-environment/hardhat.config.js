require("dotenv").config({ path: __dirname + "/.env" });

module.exports = {
  networks: {
    hardhat: {
      chainId: 1,
      forking: {
        url: process.env.FORK_RPC_URL,
        blockNumber: parseInt(process.env.BLOCK_HEIGHT),
      },
    },
  },
};
