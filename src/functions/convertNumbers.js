export function convertNumbers(number) {
    if (!number || number < 100) return number.toString();
    if (number >= 1000000000000) {
        return (number / 1000000000000).toFixed(2) + 'KH';
    } else if (number >= 1000000000) {
        return (number / 1000000000).toFixed(2) + 'A';
    } else if (number >= 10000000) {
        return (number / 10000000).toFixed(2) + 'C';
    } else if (number >= 100000) {
        return (number / 100000).toFixed(2) + 'L';
    } else if (number >= 1000) {
        return (number / 1000).toFixed(2) + 'K';
    } else {
        return (number / 100).toFixed(2) + 'H';
    }
}

// - H: Hundred (100)

// - K: Thousand (1,000)

// - L: Lakhs (100,000)

// - C: Crore (10,000,000)

// - A: Arab (1,000,000,000)

// - KH: Kharab (1,000,000,000,000)
