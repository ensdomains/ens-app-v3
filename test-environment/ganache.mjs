import "dotenv/config";
import ganache from "ganache";

const server = ganache.server({
  chain: {
    chainId: 1,
  },
  fork: {
    url: process.env.FORK_RPC_URL,
    blockNumber: parseInt(process.env.BLOCK_HEIGHT),
  },
  wallet: {
    mnemonic: "test test test test test test test test test test test junk",
  },
});

server.listen(8545, "0.0.0.0", (err) => {
  if (err) throw new Error(err.message);

  console.log("Ganache listening on port 8545");
});
