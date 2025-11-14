export type Organization = {
    id: number;
    name: string;
    location: string;
}

export type Department = {
    id: number;
    name: string;
    organizationId: number;
}