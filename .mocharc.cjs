process.env.SUI_NETWORK = 'localnet'

module.exports = {
  "loader": "ts-node/esm",
  "extension": ["ts"],
  "recursive": true,
  "timeout": 10000,
}
