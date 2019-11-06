import { callEthereumMethod } from "../util/web3/web3Wrapper";
import AssetControlBallotCategory from '../classes/AssetControlBallotCategory';

export async function getCategories(assetControlBallotContract) {
    const numberOfCategories = await callEthereumMethod(assetControlBallotContract.methods.categorySize());

    const categoryPromises = [];

    for (let index = 0; index < numberOfCategories; index++) {
        categoryPromises.push(callEthereumMethod(assetControlBallotContract.methods.getCategory(index)));
    }

    const result = await Promise.all(categoryPromises).catch(error => {
        console.error('Error Retrieving categories for car.', error);
        return [];
    });

    let categories = [];
    result.map((category, index) => categories.push(new AssetControlBallotCategory(index, category.minVotePercentage, category.title, category.exists)));

    return categories;
}