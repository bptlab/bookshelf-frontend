import ApiEndpoint from '@/apis/Chimera/ApiEndpoint';
import ActivityResponse from '@/interfaces/chimera/ActivityResponse';
import config from '@/config';

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

  // endregion

  // region private methods

  protected initialize(activityResponse: ActivityResponse) {
    this.activityLabel = activityResponse.label;
    this.activityState = activityResponse.state;
  }

  protected get(): Promise<ActivityResponse> {
    return super.get() as Promise<ActivityResponse>;
  }

  protected url(): string {
    return config.api.chimera.base + 'interface/v2/scenario/' + this.scenarioId + '/instance/' + this.instanceId + '/activity/' + this.id;
  }

  // endregion
}
