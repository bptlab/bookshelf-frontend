import Instance from '@/apis/Chimera/Instance';
import Utils from '@/Utils';
import config from '@/config';
import ScenarioResponse from '@/interfaces/chimera/ScenarioResponse';
import InstanceObect from '@/interfaces/chimera/InstanceObject';
import ApiEndpoint from '@/apis/Chimera/ApiEndpoint';
import EndpointResponse from '@/interfaces/chimera/EndpointResponse';

export default class Scenario extends ApiEndpoint {
  // region public static methods
  // endregion

  // region private static methods
  // endregion

  // region public members
  // endregion

  // region private members

  private scenarioName: string | undefined;

  // endregion

  // region constructor

  public constructor(id: string);
  public constructor(scenarioResponse: ScenarioResponse);

  public constructor(scenarioResponse: string | ScenarioResponse) {
    if (typeof scenarioResponse === 'string') {
      super(scenarioResponse as string);
    } else {
      super(scenarioResponse as EndpointResponse);
    }
  }

  // endregion

  // region public methods

  get name(): Promise<string> {
    if (this.scenarioName) {
      return new Promise(() => this.scenarioName);
    }

    return this
      .get()
      .then((scenarioObject: ScenarioResponse): string => scenarioObject.name);
  }

  public instance(id: string): Instance {
    return new Instance(this.id, id);
  }

  public async update(): Promise<Scenario> {
    await this.get();
    return this;
  }

  public async instances(): Promise<Instance[]> {
    const url: string = this.instancesUrl();
    const instanceObjects = await Utils.fetchJson(url);
    return this.createInstances(instanceObjects);
  }

  // endregion

  // region private methods

  protected initialize(scenarioResponse: ScenarioResponse) {
    super.initialize(scenarioResponse);
    this.scenarioName = scenarioResponse.name;
  }

  protected get(): Promise<ScenarioResponse> {
    return super.get() as Promise<ScenarioResponse>;
  }

  protected url(): string {
    return config.api.chimera.base + 'interface/v2/scenario/' + this.id;
  }

  private createInstance(instanceObect: InstanceObect): Instance {
    return new Instance(this.id, instanceObect);
  }

  private createInstances(instanceObects: InstanceObect[]): Instance[] {
    return instanceObects.map(this.createInstance);
  }

  private instancesUrl(): string {
    return config.api.chimera.base + 'interface/v2/scenario/' + this.id + '/instance';
  }

  // endregion
}
