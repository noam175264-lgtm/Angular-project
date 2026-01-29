export class Comment {
    constructor(
        public id: number,
        public taskId: number,
        public body: string,
        public userId: number,
        public created_at: string,
        public author_name: string,
    ) { }
}