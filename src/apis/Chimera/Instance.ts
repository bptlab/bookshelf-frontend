import ApiEndpoint from '@/apis/Chimera/ApiEndpoint';
import InstanceResponse from '@/interfaces/chimera/InstanceResponse';
import config from '@/config';
import Utils from '@/Utils';
import DataobjectResponse from '@/interfaces/chimera/DataobjectResponse';
import Dataobject from '@/apis/Chimera/Dataobject';

export default class Instance extends ApiEndpoint {
  // region public static methods
  // endregion

  // region private static methods
  // endregion

  // region public members

  public scenarioId: string = '';

  // endregion

  // region private members

  private instanceName: string | undefined;
  private instanceTerminated: boolean | undefined;
  private instanceInstantiationTime: Date | undefined;

  // endregion

  // region constructor

  public constructor(scenarioId: string, id: string);
  public constructor(scenarioId: string, instanceResponse: InstanceResponse);

  public constructor(scenarioId: string, instance: string | InstanceResponse) {
    super();
    if (typeof instance === 'string') {
      this.id = instance;
    } else {
      this.initialize(instance);
    }
    this.scenarioId = scenarioId;
  }

  // endregion

  // region public methods

  get name(): Promise<string> {
    if (this.instanceName) {
      return new Promise(() => this.instanceName);
    }

    return this
      .get()
      .then((instanceResponse: InstanceResponse): string => instanceResponse.name);
  }

  get terminated(): Promise<boolean> {
    if (this.instanceTerminated) {
      return new Promise(() => this.instanceTerminated);
    }

    return this
      .get()
      .then((instanceResponse: InstanceResponse): boolean => instanceResponse.terminated);
  }

  get instantiation(): Promise<Date> {
    if (this.instanceInstantiationTime) {
      return new Promise(() => this.instanceInstantiationTime);
    }

    return this
      .get()
      .then((instanceResponse: InstanceResponse): Date => new Date(instanceResponse.instantiation));
  }

  public async update(): Promise<Instance> {
    return super.update() as Promise<Instance>;
  }

  public async dataobjects(): Promise<Dataobject[]> {
    const url = this.dataobjectsUrl();
    const dataobjectResponses: DataobjectResponse[] = await Utils.fetchJson(url);
    return this.createDataobjects(dataobjectResponses);
  }

  // endregion

  // region private methods

  protected initialize(instanceResponse: InstanceResponse) {
    this.instanceName = instanceResponse.name;
    this.instanceTerminated = instanceResponse.terminated;
    this.instanceInstantiationTime = new Date(instanceResponse.instantiation);
  }

  protected get(): Promise<InstanceResponse> {
    return super.get() as Promise<InstanceResponse>;
  }

  protected createDataobject(dataobjectResponse: DataobjectResponse): Dataobject {
    return new Dataobject(this.scenarioId, this.id, dataobjectResponse);
  }

  protected createDataobjects(dataobjectResponses: DataobjectResponse[]): Dataobject[] {
    return dataobjectResponses.map(this.createDataobject);
  }

  protected url(): string {
    return config.api.chimera.base + 'interface/v2/scenario/' + this.scenarioId + '/instance/' + this.id;
  }

  protected dataobjectsUrl(): string {
    return config.api.chimera.base + 'interface/v2/scenario/' + this.scenarioId + '/instance/' + this.id + '/dataobject';
  }

  // endregion
}
