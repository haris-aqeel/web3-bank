require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy-ethers");
require("hardhat-gas-reporter");
require("dotenv").config();
require("hardhat-deploy");



/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY],
  },
  },
  gasReporter: {
    currency: "USD",
    outputFile: "gas-report.txt",
    enabled: false,
    noColors: true,
    coinmarketcap: process.env.COIN_MARKET_API_KEY,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      31337: 0,
      4: 0
    }
  }

};
