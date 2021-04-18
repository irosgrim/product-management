import { AvailabilityIndicator } from '@/types/types';

export function getAvailabilityStatus(amount: number): AvailabilityIndicator {
    if(amount === 0) {
        return 'none';
    }
    if(amount < 2) {
        return 'low';
    }
    if(amount <= 10) {
        return 'medium';
    }
    return 'high';

}