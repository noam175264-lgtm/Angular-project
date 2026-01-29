export class Task {
    constructor(
       public id: number,
        public title: string,
        public description: string,
        public projectId: number,
        public status: 'todo' | 'in-progress' | 'done',
        public priority: 'low' | 'normal' | 'high' | 'urgent',
        public created_at: string,
        public due_date: string,
        public assignee_id?: number,
    ) {}
}
