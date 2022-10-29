export const inRange = (input: number, max: number, min: number = 0) => {
    if (input >= min && input <= max) {
        return true;
    }
    return false;
};