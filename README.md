# Open Art Market
PoC contracts for a potential partner: https://www.openartmarket.com/


## Quick start guide
- Install dependencies: `npm install` (optional as it is performed by the publish script)
- Export your ADMIN_PHRASE as an environment variable: `export ADMIN_PHRASE=lost soul ...`
- Publish the contracts: `npm run publish -- <network>` If you don't specify a network, it will default to `local` 
- The publish script will deploy the contracts, set the .env variables, create the display and create an artwork

## Runnig scripts individually
- To create the display run `npm run create:artwork-display`
- To create an artwork run `npm run create:artwork`