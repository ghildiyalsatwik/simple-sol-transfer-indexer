import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'

const connection = new Connection(clusterApiUrl('devnet'))

const address = new PublicKey('6YuRPBWr7bCsuqqpfyVRWMb4Gi6J6T5YNzgk2tV6Kf38')

const signatures = await connection.getSignaturesForAddress(address, {limit: 10})

console.log(signatures)