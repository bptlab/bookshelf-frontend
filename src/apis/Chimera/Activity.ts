import ApiEndpoint from '@/apis/Chimera/ApiEndpoint';
import Dataobject from '@/apis/Chimera/Dataobject';
import Utils from '@/Utils';
import config from '@/config';
import ActivityResponse from '@/interfaces/chimera/ActivityResponse';
import DataobjectResponse from '@/interfaces/chimera/DataobjectResponse';
import ActivityOutputResponse from '@/interfaces/chimera/ActivityOutputResponse';

export default class Activity extends ApiEndpoint {
  // region public static methods
  // endregion

  // region private static methods
  // endregion

  // region public members

  public scenarioId: string = '';
  public instanceId: string = '';

  // endregion

  // region private members

  private activityLabel: string | undefined;
  private activityState: string | undefined;

  // endregion

  // region constructor

  public constructor(scenarioId: string, instanceId: string, id: string);
  public constructor(scenarioId: string, instanceId: string, activityResponse: ActivityResponse);

  public constructor(scenarioId: string, instanceId: string, activity: string | ActivityResponse) {
    super();
    if (typeof activity === 'string') {
      this.id = activity;
    } else {
      this.initialize(activity);
    }
    this.scenarioId = scenarioId;
    this.instanceId = instanceId;
  }

  // endregion

  // region public methods

  get label(): Promise<string> {
    if (this.activityLabel) {
      return new Promise(() => this.activityLabel);
    }

    return this
      .get()
      .then((activityResponse: ActivityResponse): string => activityResponse.label);
  }

  get state(): Promise<string> {
    if (this.activityState) {
      return new Promise(() => this.activityState);
    }

    return this
      .get()
      .then((activityResponse: ActivityResponse): string => activityResponse.state);
  }

  public async update(): Promise<Activity> {
    return super.update() as Promise<Activity>;
  }

  public async begin(dataobjects?: Dataobject[]): Promise<Response> {
    const url: string = this.beginUrl();
    let body: string[] = [];
    if (dataobjects) {
      body = dataobjects.map(
        (dataobject: Dataobject): string => dataobject.id,
      );
    }

    return fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
    });
  }

  public async output(): Promise<ActivityOutputResponse[]> {
    const url: string = this.outputUrl();
    return Utils.fetchJson(url);
  }

  public async terminate(activityOutputResponse: ActivityOutputResponse): Promise<Response> {
    //TODO: implement terminate function
  }

  // endregion

  // region private methods

  protected initialize(activityResponse: ActivityResponse) {
    this.activityLabel = activityResponse.label;
    this.activityState = activityResponse.state;
  }

  protected get(): Promise<ActivityResponse> {
    return super.get() as Promise<ActivityResponse>;
  }

  protected createDataobject(dataobjectResponse: DataobjectResponse): Dataobject {
    return new Dataobject(this.scenarioId, this.id, dataobjectResponse);
  }

  protected createDataobjects(dataobjectResponses: DataobjectResponse[]): Dataobject[] {
    return dataobjectResponses.map(this.createDataobject);
  }

  protected url(): string {
    return config.api.chimera.base + 'interface/v2/scenario/' + this.scenarioId + '/instance/' + this.instanceId + '/activityinstance/' + this.id;
  }

  protected beginUrl(): string {
    return this.url() + '/begin';
  }

  protected outputUrl(): string {
    return this.url() + '/output';
  }

  protected terminateUrl(): string {
    return this.url() + '/terminate';
  }

  // endregion
}
