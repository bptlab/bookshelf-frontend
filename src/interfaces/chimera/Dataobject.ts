import DataobjectAttribute from '@/interfaces/chimera/DataobjectAttribute';

export default interface Dataobject {
    id: string;
    dataclass: string;
    state: string;
    locked: boolean;
    attributeConfiguration: DataobjectAttribute[];
}
