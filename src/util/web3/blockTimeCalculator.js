const estimateBlockTime = async (web3, numberOfBlockAverage) => {

    return new Promise((resolve, reject) => {
        const pastBlocks = numberOfBlockAverage && numberOfBlockAverage > 0 ? numberOfBlockAverage : 20;

        let averageBlockTime = undefined;
    
        web3.eth.getBlockNumber().then(currentBlockNumber => {

            web3.eth.getBlock(currentBlockNumber).then(currentBlock => {

                web3.eth.getBlock(currentBlockNumber - pastBlocks).then(lastBlock => {

                    averageBlockTime = (currentBlock.timestamp - lastBlock.timestamp) / pastBlocks;

                    resolve(averageBlockTime);
                    
                }).catch(error => {
                    reject(error);
                });
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}



export default estimateBlockTime;