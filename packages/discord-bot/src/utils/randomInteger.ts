export interface RandomIntegerGenerator {
    (min: number, max: number, rand?: () => number): number;
}

export const randomInteger: RandomIntegerGenerator = (min, max, rand = Math.random) => {
    return Math.floor(rand() * (max - min) + min);
};