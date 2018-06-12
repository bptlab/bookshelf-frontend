import Instance from '@/apis/Chimera/Instance';
import Utils from '@/Utils';
import config from '@/config';
import ScenarioObject from '@/interfaces/chimera/ScenarioObject';
import InstanceObect from '@/interfaces/chimera/InstanceObject';

export default class Scenario {
  // region public static methods
  // endregion

  // region private static methods
  // endregion

  // region public members

  public id: string = '';

  // endregion

  // region private members

  private scenarioName: string | undefined;

  // endregion

  // region constructor

  public constructor(id: string);
  public constructor(scenarioObject: ScenarioObject);

  public constructor(scenario: string | ScenarioObject) {
    if (typeof scenario === 'string') {
      this.id = scenario;
    } else {
      this.initializeScenario(scenario);
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
      .then((scenarioObject: ScenarioObject): string => scenarioObject.name);
  }

  public async update(): Promise<Scenario> {
    await this.get();
    return this;
  }

  public async instances(): Promise<Instance[]> {
    const instancesUrl: string = this.instancesUrl();
    const instanceObjects = await Utils.fetchJson(instancesUrl);
    return this.createInstances(instanceObjects);
  }

  public instance(id: string): Instance {
    return new Instance(this.id, id);
  }

  // endregion

  // region private methods

  private initializeScenario(scenarioObject: ScenarioObject) {
    this.id = scenarioObject.id;
    this.scenarioName = scenarioObject.name;
  }

  private async get(): Promise<ScenarioObject> {
    const scenarioUrl: string = this.scenarioUrl();
    const scenarioObject = await Utils.fetchJson(scenarioUrl);
    this.initializeScenario(scenarioObject);
    return scenarioObject;
  }

  private createInstance(instanceObect: InstanceObect): Instance {
    return new Instance(this.id, instanceObect);
  }

  private createInstances(instanceObects: InstanceObect[]): Instance[] {
    return instanceObects.map(this.createInstance);
  }

  private scenarioUrl(): string {
    return config.api.chimera.base + 'interface/v2/scenario/' + this.id;
  }

  private instancesUrl(): string {
    return config.api.chimera.base + 'interface/v2/scenario/' + this.id + '/instance';
  }

  // endregion
}
