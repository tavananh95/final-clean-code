import {Category, ORDERED_CATEGORIES} from "../models/category";


export const calculateLeitnerInterval = (category: Category): number => {
    if (category === Category.DONE) {
        throw new Error("DONE category does not have a review interval.");
    }
    return Math.pow(2, ORDERED_CATEGORIES.indexOf(category));
}