import Utils from '@/Utils';
import config from '@/config';
import ScenarioInstance from '@/interfaces/ScenarioInstance';
import { Dataobject } from '@/interfaces/Dataobject';


export default class ChimeraApi {

    public static requestInstanceDataobjects(instanceId: string): Promise<Dataobject[]> {
        const url: string = ChimeraApi.getDataobjectsUrl(instanceId);
        return ChimeraApi.fetchJson(url);
    }

    public static requestScenarioDataobjects(): Promise<Dataobject[]> {
        const url: string = ChimeraApi.getScenarioInstancesUrl();

        return ChimeraApi
            .fetchJson(url)
            .then((instances: ScenarioInstance[]): Promise<Dataobject[]> => {
                let instaceObjects: Array<Promise<Dataobject[]>>;
                let dataobjects: Promise<Dataobject[]>;

                instaceObjects = instances.map((instance: any) => {
                    return this.requestInstanceDataobjects(instance.id);
                });

                dataobjects = Promise
                    .all(instaceObjects)
                    .then(Utils.mergeArrays);
                return dataobjects;
            });
    }

    private static getScenarioInstancesUrl(): string {
        return config.api.chimera.base + 'interface/v2/scenario/' + config.scenario.id + '/instance/';
    }

    private static getDataobjectsUrl(instanceId: string): string {
        return ChimeraApi.getScenarioInstancesUrl() + instanceId + '/dataobject';
    }

    private static fetchJson(url: string): Promise<any> {
        return fetch(url).then((response: Response): Promise<Response> => {
            return response.json();
        });
    }

}
