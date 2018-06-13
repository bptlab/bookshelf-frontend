import EndpointResponse from '@/interfaces/chimera/EndpointResponse';

export default interface ActivityResponse extends EndpointResponse {
    label: string;
    state: string;
}
