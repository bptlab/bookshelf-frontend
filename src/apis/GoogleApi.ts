import Utils from '@/Utils';
import Volume from '@/interfaces/google/Volume';
import config from '@/config';


export default class GoogleApi {

    // region public members
    public static getBooksByTitle(title: string): Promise<Volume[]> {
        const url: string = this.getBookSearchUrl(title);

        return Utils.fetchJson(url);
    }
    // endregion

    // region public methods
    // endregion

    // region private members
    // endregion

    // region constructor
    // endregion

    // region private methods
    private static getBookSearchUrl(title: string): string {
        const titleUrlComponent: string = '?q=' + encodeURIComponent(title);
        const keyUrlComponent: string = '&key=' + config.api.google.key;

        return this.getVolumesUrl() + titleUrlComponent + keyUrlComponent;
    }

    private static getVolumesUrl(): string {
        return `${config.api.google.base}books/v1/volumes`;
    }
    // endregion
}
