export default interface Book {
    [key: string]: any;
    title: string;
    subtitle: string;
    authors: string;
    publishedDate: Date;
    description: string;
    pageCount: number;
    language: string;
    printType: string;
    category: string;
    averageRating: number;
    imageUrl: string;
    infoUrl: string;
}
