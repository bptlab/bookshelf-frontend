import Scenario from '@/apis/Chimera/Scenario';
import Utils from '@/Utils';
import config from '@/config';
import ScenarioResponse from '@/interfaces/chimera/ScenarioResponse';

export default class ChimeraApi {
  // region public static methods

  public static async scenarios(): Promise<Scenario[]> {
    const scenariosUrl: string = this.scenariosUrl();
    const scenarioObjects = await Utils.fetchJson(scenariosUrl);
    return this.createScenarios(scenarioObjects);
  }

  public static scenario(id: string): Scenario {
    return new Scenario(id);
  }

  // endregion

  // region private static methods

  private static createScenario(scenarioObject: ScenarioResponse): Scenario {
    return new Scenario(scenarioObject);
  }

  private static createScenarios(scenarioObjects: ScenarioResponse[]): Scenario[] {
    return scenarioObjects.map(this.createScenario);
  }

  private static scenariosUrl(): string {
    return config.api.chimera.base + 'interface/v2/scenario';
  }

  // endregion

  // region public members
  // endregion

  // region private members
  // endregion

  // region constructor
  // endregion

  // region public methods
  // endregion

  // region private methods
  // endregion
}
