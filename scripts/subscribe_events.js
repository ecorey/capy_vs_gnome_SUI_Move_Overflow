import { getFullnodeUrl, SuiClient, SuiHTTPTransport } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { WebSocket } from 'ws';
import walletDev from './dev-wallet.json' assert { type: 'json' };
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {  Package } from './config.js';



// #############################################
// ############SUBSCRIBE EVENTS#################
// #############################################



// Initialize keypair
const privateKeyArray = walletDev.privateKey.split(',').map(num => parseInt(num, 10));
const privateKeyBytes = new Uint8Array(privateKeyArray);
const keypairdev = Ed25519Keypair.fromSecretKey(privateKeyBytes);



// contract events
const eventsToSubscribe = [ 
    `${Package}::card_deck::TimeEvent`,
];






// Client connection to Sui testnet
const client = new SuiClient({
    transport: new SuiHTTPTransport({
        url: getFullnodeUrl('testnet'),
        WebSocketConstructor: WebSocket
    }),
});







(async () => {
    try {
     
        
        // create Transaction Block
        const txb = new TransactionBlock();




        

        let unsubscribe = await client.subscribeEvent({
            filter: { Package },
            onMessage: (event) => {
                console.log("subscribeEvent", JSON.stringify(event, null, 2))
            }
        });
        
         
       
        process.on('SIGINT', async () => {
            console.log('Inturrpted...');
            if (unsubscribe) {
                await unsubscribe();
                unsubscribe = undefined;
            }
            
        });


        


        
        // finalize the transaction block
        let txid = await client.signAndExecuteTransactionBlock({
            signer: keypairdev,
            transactionBlock: txb,
        });
        




        // log the transaction result
        console.log(`Transaction result: ${JSON.stringify(txid, null, 2)}`);
        console.log(`success: https://suiexplorer.com/txblock/${txid.digest}?network=testnet`);



        console.log(`END OF SCRIPT`);

    } catch (e) {
        console.error(`error: ${e}`);
    }
})();