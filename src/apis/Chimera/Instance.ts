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

  private instanceName: string | undefined;
  private instanceTerminated: boolean | undefined;
  private instanceInstantiationTime: Date | undefined;

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
    if (this.instanceName) {
      return new Promise(() => this.instanceName);
    }

    return this
      .get()
      .then((instanceObject: InstanceObject): string => instanceObject.name);
  }

  get terminated(): Promise<boolean> {
    if (this.instanceTerminated) {
      return new Promise(() => this.instanceTerminated);
    }

    return this
      .get()
      .then((instanceObject: InstanceObject): boolean => instanceObject.terminated);
  }

  get instantiation(): Promise<Date> {
    if (this.instanceInstantiationTime) {
      return new Promise(() => this.instanceInstantiationTime);
    }

    return this
      .get()
      .then((instanceObject: InstanceObject): Date => new Date(instanceObject.instantiation));
  }

  public async update(): Promise<Instance> {
    await this.get();
    return this;
  }

  // endregion

  // region private methods

  private initializeInstance(instanceObject: InstanceObject) {
    this.id = instanceObject.id;
    this.instanceName = instanceObject.name;
    this.instanceTerminated = instanceObject.terminated;
    this.instanceInstantiationTime = new Date(instanceObject.instantiation);
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
