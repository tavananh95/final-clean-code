import {Category, ORDERED_CATEGORIES} from "../models/category";


export const calculateLeitnerInterval = (category: Category): number => {
    if (category === Category.DONE) {
        return 0;
    }
    return Math.pow(2, ORDERED_CATEGORIES.indexOf(category));
}