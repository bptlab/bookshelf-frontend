import EndpointResponse from '@/interfaces/chimera/EndpointResponse';

export default interface InstanceResponse extends EndpointResponse {
    name: string;
    terminated: boolean;
    instantiation: string;
}
