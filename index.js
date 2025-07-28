const { Connection, PublicKey, clusterApiUrl, SystemProgram } = require('@solana/web3.js')

const connection = new Connection(clusterApiUrl('devnet'))

const address = new PublicKey('6YuRPBWr7bCsuqqpfyVRWMb4Gi6J6T5YNzgk2tV6Kf38')

let latestTxns = []

async function getLast5Transactions() {

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
                    amount: info.lamports * 1e9,
                    time: sigInfo.blockTime,
                }

                const alreadyExists = latestTxns.find((tx) => tx.signature === signature)

                if(!alreadyExists) {

                    latestTxns.unshift(newTx)

                    if(latestTxns.length > 5) {

                        latestTxns.pop()
                    }
                }


            }
        }
    }
}


getLast5Transactions()

