import EndpointResponse from '@/interfaces/chimera/EndpointResponse';
import DataobjectAttribute from '@/interfaces/chimera/DataobjectAttribute';

export default interface DataobjectResponse extends EndpointResponse {
    dataclass: string;
    state: string;
    locked: boolean;
    attributeConfiguration: DataobjectAttribute[];
}
