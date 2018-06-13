import ApiEndpoint from '@/apis/Chimera/ApiEndpoint';
import Instance from '@/apis/Chimera/Instance';
import Dataobject from '@/apis/Chimera/Dataobject';
import Utils from '@/Utils';
import config from '@/config';
import ScenarioResponse from '@/interfaces/chimera/ScenarioResponse';
import InstanceResponse from '@/interfaces/chimera/InstanceResponse';

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

  public constructor(scenario: string | ScenarioResponse) {
    super();
    if (typeof scenario === 'string') {
      this.id = scenario;
    } else {
      this.initialize(scenario);
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
      .then((scenarioResponse: ScenarioResponse): string => scenarioResponse.name);
  }

  public async update(): Promise<Scenario> {
    return super.update() as Promise<Scenario>;
  }

  public instance(id: string): Instance {
    return new Instance(this.id, id);
  }

  public async instances(): Promise<Instance[]> {
    const url: string = this.instancesUrl();
    const instanceResponses = await Utils.fetchJson(url);
    return this.createInstances(instanceResponses);
  }

  public async dataobjects(): Promise<Dataobject[]> {
    const instances: Instance[] = await this.instances();
    const dataobjectPromises: Array<Promise<Dataobject[]>> = instances.map(
      (instance: Instance): Promise<Dataobject[]> => instance.dataobjects(),
    );
    const instanceDataobjects: Dataobject[][] = await Promise.all(dataobjectPromises);
    return Utils.mergeArrays(instanceDataobjects);
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

  private createInstance(instanceResponse: InstanceResponse): Instance {
    return new Instance(this.id, instanceResponse);
  }

  private createInstances(instanceResponses: InstanceResponse[]): Instance[] {
    return instanceResponses.map(this.createInstance);
  }

  private instancesUrl(): string {
    return config.api.chimera.base + 'interface/v2/scenario/' + this.id + '/instance';
  }

  // endregion
}
