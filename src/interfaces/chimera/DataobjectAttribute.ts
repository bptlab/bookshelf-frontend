import EndpointResponse from '@/interfaces/chimera/EndpointResponse';

export default interface DataobjectAttribute extends EndpointResponse {
    name: string;
    type: string;
    value: any;
}
