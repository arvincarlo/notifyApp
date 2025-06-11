import { z } from "zod";

export const createUserSchema = z.object({
    id: z.string().optional(),
    fullName: z.string().min(1, "Full Name is required"),
    firstName: z.string().min(1, "First Name is required"),
    middleName: z.string().optional().default(""),
    lastName: z.string().min(1, "Last Name is required"),
    emailAddress: z.string().email("Invalid email address"),
    userName: z.string().min(1, "Username is required"),
    entraId: z.string().min(1, "Entra ID is required"),
    remarks: z.string().optional(),
    role: z.enum(["SysAdmin", "Admin", "ClusterHead", "Member"]),
    permission: z.enum(["Maker", "Checker"]),
    status: z.string().min(1, "Status is required"),
    roleId: z.coerce.number().min(1, "Role Title is required"),
    profileValidityStart: z.date().min(new Date("1900-01-01"), "Profile Validity Start Date is required"),
    profileValidityEnd: z.date().min(new Date("1900-01-01"), "Profile Validity End Date is required"),
    clusterHeadId: z.coerce.number().optional(),
}).refine(
    (data) => data.role !== "Member" || (data.role === "Member" && data.clusterHeadId),
    {
        message: "Cluster Head is required when role is Member",
        path: ["clusterHeadId"],
    }
);

export const createRoleTitleSchema = z.object({
    id: z.string().optional(),
    roleName: z.string().min(1, "Role Name is required"),
})