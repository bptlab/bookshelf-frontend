import InstanceObject from '@/interfaces/chimera/InstanceObject';
import Utils from '@/Utils';
import config from '@/config';

export default class Instance {
  // region public static methods
  // endregion

  // region private static methods
  // endregion

  // region public members

  public scenarioId: string = '';
  public id: string = '';

  // endregion

  // region private members

  private _name: string | undefined;
  private _terminated: boolean | undefined;

  // endregion

  // region constructor

  constructor(scenarioId: string, id: string);
  constructor(scenarioId: string, instanceObject: InstanceObject);

  constructor(scenarioId: string, instance: string | InstanceObject) {
    this.scenarioId = scenarioId;

    if (typeof instance === 'string') {
      this.id = instance;
    } else {
      this.initializeInstance(instance);
    }
  }

  // endregion

  // region public methods

  get name(): Promise<string> {
    if (this._name) {
      return new Promise(() => this._name);
    }

    return this
      .get()
      .then((instanceObject: InstanceObject): string => instanceObject.name);
  }

  get terminated(): Promise<boolean> {
    if (this._terminated) {
      return new Promise(() => this._terminated);
    }

    return this
      .get()
      .then((instanceObject: InstanceObject): boolean => instanceObject.terminated);
  }

  public async update(): Promise<Instance> {
    await this.get();
    return this;
  }

  // endregion

  // region private methods

  private initializeInstance(instanceObject: InstanceObject) {
    this.id = instanceObject.id;
    this._name = instanceObject.name;
    this._terminated = instanceObject.terminated;
  }

  private async get(): Promise<InstanceObject> {
    const instanceUrl: string = this.instanceUrl();
    const instanceObject = await Utils.fetchJson(instanceUrl);
    this.initializeInstance(instanceObject);
    return instanceObject;
  }

  private instanceUrl(): string {
    return config.api.chimera.base + 'interface/v2/scenario/' + this.scenarioId + '/instance/' + this.id;
  }

  // endregion
}
