import Utils from '@/Utils';
import EndpointResponse from '@/interfaces/chimera/EndpointResponse';

export default class ApiEndpoint {
  // region public static methods
  // endregion

  // region private static methods
  // endregion

  // region public members

  public id: string = '';

  // endregion

  // region private members
  // endregion

  // region constructor

  public constructor(id: string);
  public constructor(endpointResponse: EndpointResponse);

  public constructor(endpointResponse: string | EndpointResponse) {
    if (typeof endpointResponse === 'string') {
      this.id = endpointResponse;
    } else {
      this.initialize(endpointResponse);
    }
  }

  // endregion

  // region public methods

  public async update(): Promise<ApiEndpoint> {
    await this.get();
    return this;
  }

  // endregion

  // region private methods

  protected initialize(endpointResponse: EndpointResponse) {
    this.id = endpointResponse.id;
  }

  protected async get(): Promise<EndpointResponse> {
    const url: string = this.url();
    const endpointObject = await Utils.fetchJson(url);
    this.initialize(endpointObject);
    return endpointObject;
  }

  protected url(): string {
    throw Error('Function url() is not implemented.');
  }

  // endregion
}
