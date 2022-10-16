export const randomInteger = (min: number, max: number, rand: () => number = Math.random) => {
    return Math.floor(rand() * (max - min) + min);
};