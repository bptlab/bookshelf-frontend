import ApiEndpoint from '@/apis/Chimera/ApiEndpoint';
import DataobjectResponse from '@/interfaces/chimera/DataobjectResponse';
import DataobjectAttribute from '@/interfaces/chimera/DataobjectAttribute';
import config from '@/config';

export default class Dataobject extends ApiEndpoint {
  // region public static methods
  // endregion

  // region private static methods
  // endregion

  // region public members

  public scenarioId: string = '';
  public instanceId: string = '';

  // endregion

  // region private members

  private dataobjectDataclass: string | undefined;
  private dataobjectState: string | undefined;
  private dataobjectAttributes: DataobjectAttribute[] | undefined;

  // endregion

  // region constructor

  public constructor(scenarioId: string, instanceId: string, id: string);
  public constructor(scenarioId: string, instanceId: string, dataobjectResponse: DataobjectResponse);

  public constructor(scenarioId: string, instanceId: string, dataobject: string | DataobjectResponse) {
    super();
    if (typeof dataobject === 'string') {
      this.id = dataobject;
    } else {
      this.initialize(dataobject);
    }
    this.scenarioId = scenarioId;
    this.instanceId = instanceId;
  }

  // endregion

  // region public methods

  get dataclass(): Promise<string> {
    if (this.dataobjectDataclass) {
      return new Promise(() => this.dataobjectDataclass);
    }

    return this
      .get()
      .then((dataobjectResponse: DataobjectResponse): string => dataobjectResponse.dataclass);
  }

  get state(): Promise<string> {
    if (this.dataobjectState) {
      return new Promise(() => this.dataobjectState);
    }

    return this
      .get()
      .then((dataobjectResponse: DataobjectResponse): string => dataobjectResponse.state);
  }

  get attributes(): Promise<DataobjectAttribute[]> {
    if (this.dataobjectAttributes) {
      return new Promise(() => this.dataobjectAttributes);
    }

    return this
      .get()
      .then(
        (dataobjectResponse: DataobjectResponse): DataobjectAttribute[] => dataobjectResponse.attributeConfiguration,
    );
  }

  public async update(): Promise<Dataobject> {
    return super.update() as Promise<Dataobject>;
  }

  // endregion

  // region private methods

  protected initialize(dataobjectResponse: DataobjectResponse) {
    this.dataobjectDataclass = dataobjectResponse.dataclass;
    this.dataobjectState = dataobjectResponse.state;
    this.dataobjectAttributes = dataobjectResponse.attributeConfiguration;
  }

  protected get(): Promise<DataobjectResponse> {
    return super.get() as Promise<DataobjectResponse>;
  }

  protected url(): string {
    return config.api.chimera.base + 'interface/v2/scenario/' + this.scenarioId + '/instance/' + this.instanceId + '/dataobject/' + this.id;
  }

  // endregion
}
