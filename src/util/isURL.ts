export const isURL = (s: string) => {
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
};