export const SELECTED_USER = {
    fullName: "",
    userName: "",
    email: "",
    id: "",
}

export const CREATE_USER = {
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    fullName: "",
    emailAddress: "",
    username: "",
    entraId: "",
    remarks: "",
    role: "" as "Member" | "SysAdmin" | "Admin" | "ClusterHead" | undefined,
    status: "",
    permission: "" as "Maker" | "Checker" | undefined,
    roleId: 0,
    profileValidityStart: undefined,
    profileValidityEnd: undefined,
    clusterHeadId: 0,
};