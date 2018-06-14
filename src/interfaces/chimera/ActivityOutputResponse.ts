import EndpointResponse from '@/interfaces/chimera/EndpointResponse';

export default interface ActivityOutputResponse extends EndpointResponse {
    states: string[];
}
