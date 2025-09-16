/**
 * TEST SIMPLE - Vérification que Jest fonctionne
 */

describe('Tests simples', () => {
    test('should add numbers correctly', () => {
        expect(2 + 2).toBe(4);
        expect(10 - 5).toBe(5);
    });

    test('should handle strings', () => {
        expect('La Belle'.concat(' Bretagne')).toBe('La Belle Bretagne');
    });

    test('should work with arrays', () => {
        const pois = ['Château', 'Plage', 'Musée'];
        expect(pois).toHaveLength(3);
        expect(pois[0]).toBe('Château');
    });
});

describe('Tests utilitaires de base', () => {
    test('should format distance correctly', () => {
        function formatDistance(distance) {
            if (distance < 1000) {
                return `${Math.round(distance)}m`;
            } else {
                return `${(distance / 1000).toFixed(1)}km`;
            }
        }

        expect(formatDistance(500)).toBe('500m');
        expect(formatDistance(1500)).toBe('1.5km');
        expect(formatDistance(2000)).toBe('2.0km');
    });

    test('should validate coordinates', () => {
        function isValidCoords(lat, lng) {
            return typeof lat === 'number' &&
                   typeof lng === 'number' &&
                   lat >= -90 && lat <= 90 &&
                   lng >= -180 && lng <= 180;
        }

        expect(isValidCoords(48.8566, 2.3522)).toBe(true);
        expect(isValidCoords(91, 0)).toBe(false);
        expect(isValidCoords(0, 181)).toBe(false);
    });
});