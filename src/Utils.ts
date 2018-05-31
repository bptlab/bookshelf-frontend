export default class Utils {

    public static mergeArrays(array: any[][]): any[] {
        return array.reduce((arr, row) => {
            return arr.concat(row);
        }, []);
    }

    public static fetchJson(url: string): Promise<any> {
        return fetch(url).then((response: Response): Promise<Response> => {
            return response.json();
        });
    }
}
