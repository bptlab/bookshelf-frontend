import ApiEndpoint from '@/apis/Chimera/ApiEndpoint';
import Dataobject from '@/apis/Chimera/Dataobject';
import Utils from '@/Utils';
import config from '@/config';
import ActivityResponse from '@/interfaces/chimera/ActivityResponse';
import DataobjectResponse from '@/interfaces/chimera/DataobjectResponse';

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
      return Promise.resolve(this.activityLabel);
    }

    return this
      .get()
      .then((activityResponse: ActivityResponse): string => activityResponse.label);
  }

  get state(): Promise<string> {
    if (this.activityState) {
      return Promise.resolve(this.activityState);
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
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
  }

  public async output(): Promise<any> {
    const url: string = this.outputUrl();
    return Utils.fetchJson(url);
  }

  public async terminate(dataStateMapping: any, dataAttributeMapping: any): Promise<Response> {
    const url: string = this.terminateUrl();
    const body = {
      transitions: JSON.stringify(dataStateMapping),
      values: JSON.stringify(dataAttributeMapping),
    };
    return fetch(url, {
      method: 'post',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  public async complete(dataobjects?: Dataobject[]) {
    if (dataobjects) {
      await this.begin(dataobjects);
    } else {
      await this.begin();
    }
    const output = await this.output();
    const dataStateMapping: any = {};
    Object.keys(output).forEach((key: string) => {
      dataStateMapping[key] = output[key]!.states[0];
    });
    await this.terminate(dataStateMapping, {});
  }

  public async completeWithoutInput(dataAttributeMapping: any) {
    await this.begin();
    const output = await this.output();
    const dataStateMapping: any = {};
    Object.keys(output).forEach((key: string) => {
      dataStateMapping[key] = output[key]!.states[0];
    });
    await this.terminate(dataStateMapping, dataAttributeMapping);
  }

  // endregion

  // region private methods

  protected initialize(activityResponse: ActivityResponse) {
    super.initialize(activityResponse);
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
    return config.api.chimera.base + 'interface/v2/scenario/' + this.scenarioId + '/instance/' + this.instanceId +
      '/activityinstance/' + this.id;
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
