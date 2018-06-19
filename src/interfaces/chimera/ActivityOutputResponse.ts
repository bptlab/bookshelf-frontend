import DataobjectAttribute from '@/interfaces/chimera/DataobjectAttribute';

export default interface ActivityOutputResponse {
    state: string;
    attributeConfiguration: DataobjectAttribute[];
    states: string[];
}
