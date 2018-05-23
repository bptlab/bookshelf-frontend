export default class Utils {

    public static mergeArrays(array: any[][]): any[] {
        return array.reduce((arr, row) => {
            return arr.concat(row);
        }, []);
    }

}
