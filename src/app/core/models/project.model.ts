export class Project {
    constructor(
        public id: number,
        public team_id: number,
        public name: string,
        public description: string,
        public status: string,
        public created_at: string,
    ) {
    }
}
