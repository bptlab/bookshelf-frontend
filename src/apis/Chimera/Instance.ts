import ApiEndpoint from '@/apis/Chimera/ApiEndpoint';
import Dataobject from '@/apis/Chimera/Dataobject';
import Activity from '@/apis/Chimera/Activity';
import config from '@/config';
import Utils from '@/Utils';
import InstanceResponse from '@/interfaces/chimera/InstanceResponse';
import DataobjectResponse from '@/interfaces/chimera/DataobjectResponse';
import ActivityResponse from '@/interfaces/chimera/ActivityResponse';

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
      return Promise.resolve(this.instanceName);
    }

    return this
      .get()
      .then((instanceResponse: InstanceResponse): string => instanceResponse.name);
  }

  get terminated(): Promise<boolean> {
    if (this.instanceTerminated) {
      return Promise.resolve(this.instanceTerminated);
    }

    return this
      .get()
      .then((instanceResponse: InstanceResponse): boolean => instanceResponse.terminated);
  }

  get instantiation(): Promise<Date> {
    if (this.instanceInstantiationTime) {
      return Promise.resolve(this.instanceInstantiationTime);
    }

    return this
      .get()
      .then((instanceResponse: InstanceResponse): Date => new Date(instanceResponse.instantiation));
  }

  public async update(): Promise<Instance> {
    return super.update() as Promise<Instance>;
  }

  public dataobject(id: string): Dataobject {
    return new Dataobject(this.scenarioId, this.id, id);
  }

  public async dataobjects(): Promise<Dataobject[]> {
    const url = this.dataobjectsUrl();
    const dataobjectResponses: DataobjectResponse[] = await Utils.fetchJson(url);
    return this.createDataobjects(dataobjectResponses);
  }

  public activity(id: string): Activity {
    return new Activity(this.scenarioId, this.id, id);
  }

  public async activities(): Promise<Activity[]> {
    const url = this.activitiesUrl();
    const activitiesResponse: ActivityResponse[] = await Utils.fetchJson(url);
    return this.createActivities(activitiesResponse);
  }

  // endregion

  // region private methods

  protected initialize(instanceResponse: InstanceResponse) {
    super.initialize(instanceResponse);
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
    return dataobjectResponses.map(this.createDataobject.bind(this));
  }

  protected createActivity(activityResponse: ActivityResponse): Activity {
    return new Activity(this.scenarioId, this.id, activityResponse);
  }

  protected createActivities(activitiesResponse: ActivityResponse[]): Activity[] {
    return activitiesResponse.map(this.createActivity.bind(this));
  }

  protected url(): string {
    return config.api.chimera.base + 'interface/v2/scenario/' + this.scenarioId + '/instance/' + this.id;
  }

  protected dataobjectsUrl(): string {
    return config.api.chimera.base + 'interface/v2/scenario/' + this.scenarioId + '/instance/' + this.id + '/dataobject';
  }

  protected activitiesUrl(): string {
    return config.api.chimera.base + 'interface/v2/scenario/' + this.scenarioId + '/instance/' + this.id + '/activity';
  }

  // endregion
}
