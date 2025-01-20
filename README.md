# Focusify
![Focusify Logo ](/frontend/app/favicon.ico)
![Project Image (readmegif.gif)

## Awards 

 - Challenge Winner for *Starknet Challenge* [@UottaHack 7 Hackathon] (https://2025.uottahack.ca/) 🎖️

## Background

A Starknet powered smart contract platform aimed to provide event-based focus groups 🧠, lessons 🧑‍🏫, and competition hosting ⚒️. This work is meant to be and continue to be open source, feel free to contact me or interact this repo for contibutions

We identified a significant gap between students' intentions and professioals alike to work,  study, anf focus on their actual commitment. Focusify aims to solve this, we developed a decentralized platform that gamifies accountability. On this platform, users can stake money against one another, creating a financial incentive to stay focused. If a student leaves the session prematurely, their stake is redistributed among those who remain. This system encourages longer, more effective study sessions while turning learning into a collaborative and motivating experience with tangible rewards. 

On the roadmap, focusify will implement more parameters and administration setting on rooms that will enable prize distrbution for smart competitions, lessons or sponsorships a particular event might need.  Moreover, we plan to evolve this project by allowing users to vote on specific causes within rooms, ensuring adherence to group rules, and expanding the features to further enhance engagement and accountability. We aim to increase crypto adoption through underrepresented needs in the crypto space.

## Backend
The backend is a straightforward Cairo script, located at `backend/src/lib.cairo`. 
This script enables the UI to interact with the smart contract, allowing most data to be stored using a `felt252` type via encoding tactics.

Here is the deployed version of smart contract on [Starkscan](https://sepolia.starkscan.co/contract/0x07b4875c6ee142b302cf6ab74803a368992e82ff4087afeaa1bd1c9ab0a57a43#read-write-contract-sub-write)

You can explore the backend code here:  
[GitHub Repository](https://github.com/matias-io/focusify/tree/main/backend/src)

### Building Backend
If you want to run it, you need to first build it, 

If you are running it on a UNIX environment, please do the following : 
        
        // Builds the project
        Scarb build
        
        
        // deploys the account (only do ONCE on initiation) 
        starkli account deploy account.json --keystore keystore.json


        
        // Declaration
        starkli declare target/dev/backend_HelloStarknet.contract_class.json--account account.json --keystore keystore.json

        
        
        // Deployment to Starkscan
        starkli deploy [hash] [constructor params] --account account.json --keystore keystore.json
        
        For more info not covered, considered official docs by [Starknet](https://docs.starknet.io/quick-start/environment-setup/)

## Frontend

Note: If errors occur due to outdated packages. use **--force** flag due to adoption of React 19, which isn't formally liked by most dependancies 🥲

### Running locally in development mode

To get started, just clone the repository and run `npm install && npm run dev`:

    git clone https://github.com/iaincollins/nextjs-starter.git
    npm install
    npm run dev

Note: If you are running on Windows run install --noptional flag (i.e. `npm install --no-optional`) which will skip installing fsevents.

### Building and deploying in production

If you wanted to run this site in production, you should install modules then build the site with `npm run build` and run it with `npm start`:

    npm install
    npm run build
    npm start

You should run `npm run build` again any time you make changes to the site.

Note: If you are already running a webserver on port 80 (e.g. Macs usually have the Apache webserver running on port 80) you can still start the example in production mode by passing a different port as an Environment Variable when starting (e.g. `PORT=3000 npm start`).
