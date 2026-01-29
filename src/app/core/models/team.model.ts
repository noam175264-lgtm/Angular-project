export class Team {
    constructor(
        public id: number,
        public name: string,
        public members: TeamMember[],
        public projectsCount?: number,
        public members_count?: number,
        public createdAt?: string
    ) { }
}
export class TeamMember {
    constructor(
        public id: number,
        public name: string,
        public role: 'owner' | 'admin' | 'member',
    ) { }
}