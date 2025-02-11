export interface Blog {
    id: number;
    title: string;
    description: string;
    content: string;
    authorId: number;
    tagIds: number[];
    isDeleted: boolean;
}