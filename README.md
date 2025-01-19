# Focusify!

## Background

We identified a significant gap between students' intentions to work or study and their actual commitment. To address this, we developed a decentralized platform that gamifies accountability. On this platform, students can stake money against one another, creating a financial incentive to stay focused. If a student leaves the session prematurely, their stake is redistributed among those who remain. This system encourages longer, more effective study sessions while turning learning into a collaborative and motivating experience with tangible rewards.

This is just our first implementation, with the primary goal of promoting cryptocurrency and Ethereum usage among youth, while also providing students with real value for studying.

Looking ahead, we plan to evolve this project by allowing users to vote on specific causes within rooms, ensuring adherence to group rules, and expanding the features to further enhance engagement and accountability.

## Backend
The backend is a straightforward Cairo script, located at `backend/src/lib.cairo`. 
This script enables the UI to interact with the smart contract, allowing data to be stored using a `felt252` type.
There are basic getter and setter functions

Here is the deployed version of smart contract on [Starkscan](https://sepolia.starkscan.co/contract/0x07b4875c6ee142b302cf6ab74803a368992e82ff4087afeaa1bd1c9ab0a57a43#read-write-contract-sub-write)

You can explore the backend code here:  
[GitHub Repository](https://github.com/matias-io/focusify/tree/main/backend/src)

## Frontend

Note: If errors occur due to outdated packages. use **--force** flag.

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
