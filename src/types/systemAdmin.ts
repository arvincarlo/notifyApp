export type Pagination<T> = {
    items: T[];
    pageSize: number;
    pageNumber: number;
    totalPages: number;
    totalCount: number;
};

export type LoggedInUser = {
    id: string;
    username: string;
    name: string;
};

export type UserItem = {
    id: number;
    fullName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    emailAddress: string;
    userName: string;
    entraId: string;
    role: string;
    roleTitle: {
        id: number;
        roleName: string;
    };
    remarks: string | undefined;
    status: string;
    profileValidityStart: string;
    profileValidityEnd: string;
    lastLoginDate: string | null;
    clusterHeadId: string | null;
};

export type RoleTitleItem = {
    id: number;
    roleName: string;
}

export type CreateUser = {
    userName: string;
    entraId: string;
    fullName: string;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    emailAddress: string;
    role: string;
    roleId: number;
    remarks?: string | null;
    profileValidityStart: string | Date;
    profileValidityEnd: string | Date;
    status: string;
    lastLoginDate: string;
    clusterHeadId?: number | null;
};

export type EditUser = CreateUser & {
    id: number;
    roleTitle: RoleTitleItem
}

export type ClusterHeadItem = {
    id: number;
    name: string;
}