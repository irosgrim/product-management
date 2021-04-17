import { getProductsAndAvailability, partialStringMatch } from '../src/helpers/db';
import { RequestStatus } from '../src/helpers/routes';

describe('Route helper', () => {
    const sut = new RequestStatus();
    test('it should return 200 when calling ok', () => {
        expect(sut.ok).toEqual(200);
    });
    test('it should return 400 when calling badRequest', () => {
        expect(sut.badRequest).toEqual(400);
    })
    test('it should return 404 when calling notFound', () => {
        expect(sut.notFound).toEqual(404);
    })
})

describe('Partial string match helper', () => {
    const partialStrMatch = partialStringMatch('hello');
    test('it should return false when not matching', () => {
        const sut = partialStrMatch('scooby dooo');
        expect(sut).toBeFalsy();
    })
    test('it should return true when partial matching', () => {
        const sut = partialStrMatch('scooby hello dooo');
        expect(sut).toBeTruthy();
    });
})

describe('Transform Product in ProductWithAvailability', () => {
    const exampleInput = {
        name: "Dining Chair",
        contain_articles: [
            {
                art_id: "1",
                amount_of: 4
            },
            {
                art_id: "2",
                amount_of: 8
            },
            {
                art_id: "3",
                amount_of: 1
            }
        ]
      }
    const sut = getProductsAndAvailability(exampleInput);
    test('it should return an object that containes potential_availability', () => {
        expect(sut.potential_availability).toBeDefined();
    });
    test('potential_availability should be correct with default inventory', () => {
        expect(sut.potential_availability).toEqual(2);
    });
})