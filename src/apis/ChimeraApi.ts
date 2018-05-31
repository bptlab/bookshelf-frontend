import Utils from '@/Utils';
import ScenarioInstance from '@/interfaces/chimera/ScenarioInstance';
import Dataobject from '@/interfaces/chimera/Dataobject';
import config from '@/config';


export default class ChimeraApi {

    // region public members
    public static getInstanceDataobjects(instanceId: string): Promise<Dataobject[]> {
        const url: string = this.getDataobjectsUrl(instanceId);

        return Utils.fetchJson(url);
    }

    public static getScenarioDataobjects(): Promise<Dataobject[]> {
        const url: string = this.getScenarioInstancesUrl();

        return Utils
            .fetchJson(url)
            .then(this.getInstancesDataobjects);
    }
    // endregion

    // region public methods
    // endregion

    // region private members
    // endregion

    // region constructor
    // endregion

    // region private methods
    private static getInstancesDataobjects(instances: ScenarioInstance[]): Promise<Dataobject[]> {
        let instaceObjects: Array<Promise<Dataobject[]>>;
        let dataobjects: Promise<Dataobject[]>;

        instaceObjects = instances.map((instance: any) => {
            return ChimeraApi.getInstanceDataobjects(instance.id);
        });

        dataobjects = Promise
            .all(instaceObjects)
            .then(Utils.mergeArrays);
        return dataobjects;
    }

    private static getScenarioInstancesUrl(): string {
        return config.api.chimera.base + 'interface/v2/scenario/' + config.scenario.id + '/instance/';
    }

    private static getDataobjectsUrl(instanceId: string): string {
        return this.getScenarioInstancesUrl() + instanceId + '/dataobject';
    }
    // endregion
}
