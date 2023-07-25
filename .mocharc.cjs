process.env.SUI_NETWORK = 'http://127.0.0.1:9000'

module.exports = {
  "loader": "ts-node/esm",
  "extension": ["ts"],
  "recursive": true,
  "timeout": 10000,
}
