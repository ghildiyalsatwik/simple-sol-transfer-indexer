const { Connection, PublicKey, clusterApiUrl, SystemProgram } = require('@solana/web3.js')
const express = require("express")
const cors = require("cors")
require('dotenv').config()

const app = express()

app.use(cors())

const PORT = process.env.PORT || 3000

const connection = new Connection(clusterApiUrl('devnet'))

async function getLast5Transactions(publickey) {

    const latestTxns = []

    try {    
        
        const address = new PublicKey(publickey)

        const signatures = await connection.getSignaturesForAddress(address, {limit: 10})


        for(const sigInfo of signatures) {

            const { signature } = sigInfo

            const tx = await connection.getParsedTransaction(signature, 'confirmed')

            if(!tx) continue

            for(const instr of tx.transaction.message.instructions) {

                if(instr.programId.equals(SystemProgram.programId) && instr.parsed?.type === 'transfer') {

                    const info = instr.parsed.info

                    const newTx = {

                        signature,
                        from: info.source,
                        to: info.destination,
                        amount: info.lamports/1e9,
                        time: sigInfo.blockTime,
                    }

                    latestTxns.push(newTx)

                    if(latestTxns.length === 5) return latestTxns


                }
            }
        }

        return latestTxns

    } catch (err) {
        
        console.error("Error in getLast5Transactions:", err);
    
    }
}


app.get('/transactions', async (req, res) => {

    console.log("Received a request")

    const addressString = req.query.address

    if (!addressString) {
        
        return res.status(400).json({ error: "Missing address query parameter" });
    
    }

    try {
        
        const latestTxns = await getLast5Transactions(addressString)

        res.json(latestTxns)

    } catch(err) {

        res.status(500).json({error: 'Failed to fetch transactions'})
    }
})


app.listen(PORT, () => {

    console.log(`Server listening on http://localhost:${PORT}`)
})

