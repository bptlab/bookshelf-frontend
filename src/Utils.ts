import { filter } from 'p-iteration';
import Dataobject from '@/apis/Chimera/Dataobject';
import DataobjectAttribute from '@/interfaces/chimera/DataobjectAttribute';
import Book from '@/interfaces/Book';

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

    public static async initializeBook(dataobject: Dataobject): Promise<Book> {
        const book: Book = {
            title: '',
            subtitle: '',
            authors: '',
            publishedDate: new Date(),
            description: '',
            pageCount: 0,
            language: '',
            printType: '',
            category: '',
            averageRating: 0,
            imageUrl: '',
            infoUrl: '',
        };

        const attributes = await dataobject.attributes;
        attributes.forEach((attribute: DataobjectAttribute) => {
                if (attribute.name === 'publishedDate') {
                    book[attribute.name] = new Date(attribute.value);
                } else {
                    book[attribute.name] = attribute.value;
                }
            },
        );

        return book;
    }

    public static async filterDataobjectsByState(dataobjects: Dataobject[], state: string): Promise<Dataobject[]> {
        return await filter(dataobjects, async (dataobject: Dataobject): Promise<boolean> => {
            return await dataobject.state === state;
        });
    }
}
