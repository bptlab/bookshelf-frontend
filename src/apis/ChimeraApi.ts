import Utils from '@/Utils';
import ScenarioInstance from '@/interfaces/chimera/ScenarioInstance';
import Dataobject from '@/interfaces/chimera/Dataobject';
import Activity from '@/interfaces/chimera/Activity';
import Book from '@/interfaces/Book';
import config from '@/config';


export default class ChimeraApi {

    // region public members
    // endregion

    // region public methods
    public static async getInstanceDataobjects(instanceId: string): Promise<Dataobject[]> {
        const url: string = this.getDataobjectsUrl(instanceId);

        return Utils.fetchJson(url);
    }

    public static async getInstanceActivities(instanceId: string): Promise<Activity[]> {
        const url: string = this.getActivitiesUrl(instanceId);

        return Utils.fetchJson(url);
    }

    public static async getEnabledActivities(instanceId: string): Promise<Activity[]> {
        return this.getInstanceActivities(instanceId)
            .then((activities: Activity[]): Activity[] => {
                return activities.filter((activity: Activity) => {
                    return activity.state === 'READY';
                });
            });
    }

    public static async getScenarioDataobjects(): Promise<Dataobject[]> {
        const url: string = this.getScenarioInstancesUrl();
        const scenarios: ScenarioInstance[] = await Utils.fetchJson(url);

        return this.fetchScenarioDataobjects(scenarios);
    }

    public static startInstance(book: Book) {
        const url: string = this.getInstanceStartUrl();
        return fetch(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book),
        });
    }

    public static getActivityOutput(instanceId: string, activityId: string) {
        const url: string = this.getActivityOutputUrl(instanceId, activityId);

        return Utils.fetchJson(url);
    }

    public static beginActivity(instanceId: string, activityId: string, dataobjectId?: string) {
        const url: string = this.getActivityBeginUrl(instanceId, activityId);
        const dataobjects = [ dataobjectId ];

        return fetch(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataobjects),
        });
    }

    public static async terminateActivity(instanceId: string, activityId: string) {
        const url: string = this.getActivityTerminateUrl(instanceId, activityId);
        return this.getActivityOutput(instanceId, activityId)
            .then( (dataobjects) => {
                Object.keys(dataobjects).map((key) => {
                    dataobjects[key] = dataobjects[key].states[0];
                });

                setTimeout(() => {
                    fetch(url, {
                        method: 'post',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ transitions: JSON.stringify(dataobjects), values: '{}' }),
                    });
                }, 30000);
                
            });
    }

    public static completeActivity(instanceId: string, activityId: string, dataobjectId?: string) {
        return this.beginActivity(instanceId, activityId, dataobjectId)
            .then(() => {
                this.terminateActivity(instanceId, activityId);
            });
    }
    // endregion

    // region private members
    // endregion

    // region constructor
    // endregion

    // region private methods
    private static fetchScenarioDataobjects(instances: ScenarioInstance[]): Promise<Dataobject[]> {
        let scenarioObjects: Array<Promise<Dataobject[]>>;
        let dataobjects: Promise<Dataobject[]>;

        scenarioObjects = instances.map((instance: any) => {
            return ChimeraApi
                .getInstanceDataobjects(instance.id)
                .then((instanceObjects: Dataobject[]): Dataobject[] => {
                    return instanceObjects.map((dataobject: Dataobject) => {
                        dataobject.instanceId = instance.id;
                        return dataobject;
                    });
                });
        });

        dataobjects = Promise
            .all(scenarioObjects)
            .then(Utils.mergeArrays);
        return dataobjects;
    }

    private static getScenarioInstancesUrl(): string {
        return config.api.chimera.base + 'interface/v2/scenario/' + config.scenario.id + '/instance/';
    }

    private static getDataobjectsUrl(instanceId: string): string {
        return this.getScenarioInstancesUrl() + instanceId + '/dataobject';
    }

    private static getActivitiesUrl(instanceId: string): string {
        return this.getScenarioInstancesUrl() + instanceId + '/activity';
    }

    private static getActivityUrl(instanceId: string, activityId: string): string {
        return this.getActivitiesUrl(instanceId) + 'instance/' + activityId;
    }

    private static getActivityBeginUrl(instanceId: string, activityId: string): string {
        return this.getActivityUrl(instanceId, activityId) + '/begin';
    }

    private static getActivityTerminateUrl(instanceId: string, activityId: string): string {
        return this.getActivityUrl(instanceId, activityId) + '/terminate';
    }

    private static getActivityOutputUrl(instanceId: string, activityId: string): string {
        return this.getActivityUrl(instanceId, activityId) + '/output';
    }

    private static getInstanceStartUrl(): string {
        return config.api.chimera.base + 'eventdispatcher/scenario/' + config.scenario.id + '/casestart/' + config.scenario.caseStart;
    }
    // endregion
}
