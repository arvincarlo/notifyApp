import { axiosInstance } from "@/lib/axios";
import { toastError } from "@/lib/utils";
import { CreateUser as CreateUserType, EditUser, Pagination, RoleTitleItem, UserItem } from "@/types/systemAdmin";

export const wealthService = {
  logout: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get("/api/Auth/logout");
      return response.data;
    } catch (error) {
      console.error("Failed to logout:", error);
      throw error;
    }
  },
  getWealthData: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get("/api/WealthApp/GetData");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch wealth data:", error);
      throw error;
    }
  },
  getWealthAllCustoms: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get("/WealthApp/GetAllCustomers");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch wealth data:", error);
      throw error;
    }
  },
  getWealthCustomerByCif: async (cif: string): Promise<any> => {
    try {
      const response = await axiosInstance.get(`/WealthApp/SearchByCif/${cif}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch wealth data:", error);
      throw error;
    }
  },
  getWealthCustomerByName: async (name: string): Promise<any> => {
    try {
      const response = await axiosInstance.get(
        `/WealthApp/SearchByName/${name}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch wealth data:", error);
      throw error;
    }
  },
  getFcbAccounts: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get("/Fcbs/GetAllDeposits");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch wealth data:", error);
      throw error;
    }
  },
  getAllTransactionHistory: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get(
        "/Fcbs/GetAllTransactionHistory"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch wealth data:", error);
      throw error;
    }
  },
  getTrustPortfolioAccounts: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get(
        "/TrustPortfolio/GetAllTrustDeposits"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch wealth data:", error);
      throw error;
    }
  },
  getActivityHistory: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get(
        "/ActivityHistory/GetAllActivityHistory"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch wealth data:", error);
      throw error;
    }
  },
  createActivity: async (data: any): Promise<any> => {
    try {
      const response = await axiosInstance.post(
        "/ActivityHistory/AddActivityHistory",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch wealth data:", error);
      throw error;
    }
  },
  getActivityHistoryById: async (id: string): Promise<any> => {
    try {
      const response = await axiosInstance.get(
        `/ActivityHistory/GetActivityHistoryById/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch wealth data:", error);
      throw error;
    }
  },

  getAllDisclosures: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get("/Disclosure/GetAllDisclosures");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch disclosure data:", error);
      throw error;
    }
  },

  getAllDisclosureById: async (id: string): Promise<any> => {
    try {
      const response = await axiosInstance.get(
        `/Disclosure/GetAllDisclosuresById/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch disclosure data:", error);
      throw error;
    }
  },
  deleteDisclosureById: async (id: string): Promise<any> => {
    try {
      const response = await axiosInstance.delete(
        `/Disclosure/DeleteDisclosure/${id}`
      );
      return response;
    } catch (error) {
      console.error("Failed to delete disclosure data:", error);
      throw error;
    }
  },

  createDisclosure: async (data: any): Promise<any> => {
    try {
      const response = await axiosInstance.post(
        `/Disclosure/CreateDisclosure`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create disclosure data:", error);
      throw error;
    }
  },
  editDisclosureById: async (data: any, id): Promise<any> => {
    try {
      const response = await axiosInstance.put(
        `/Disclosure/UpdateDisclosureById/${id}`,
        data
      );

      return response;
    } catch (error) {
      console.error("Failed to update disclosure data:", error);
      throw error;
    }
  },

  getAllParameters: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get(
        `/ParameterMaintenance/GetAllParameters`
      );

      return response.data;
    } catch (error) {
      console.error("Failed to get all parameters data:", error);
      throw error;
    }
  },

  getAllParametersByStatus: async (status: string): Promise<any> => {
    try {
      const response = await axiosInstance.get(
        `/ParameterMaintenance/GetParameterStatus?status=${status}`
      );

      return response.data;
    } catch (error) {
      console.error("Failed to get all parameters data:", error);
      throw error;
    }
  },

  editParameterById: async (data: any, id): Promise<any> => {
    try {
      const response = await axiosInstance.put(
        `/ParameterMaintenance/UpdateCustomer/${id}`,
        data
      );

      return response;
    } catch (error) {
      console.error("Failed to update parameter data:", error);
      throw error;
    }
  },

  editParameterStatus: async (data: any): Promise<any> => {
    try {
      const response = await axiosInstance.post(
        `/ParameterMaintenance/PostParameter`,
        {
          ...data,
          status: "pending",
        }
      );

      return response;
    } catch (error) {
      console.error("Failed to update parameter data:", error);
      throw error;
    }
  },

  getAllLogs: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get(`/AuditLog/GetAllLogs`);
      return response.data;
    } catch (error) {
      console.error("Failed to get all logs data:", error);
      throw error;
    }
  },

  getLogsById: async (id: number): Promise<any> => {
    try {
      const response = await axiosInstance.get(
        `/AuditLog/GetAuditLogsById/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch log:", error);
      throw error;
    }
  },

  createLogs: async (data: any): Promise<any> => {
    try {
      const response = await axiosInstance.post(`/AuditLog/CreateLogs`, data);
      return response.data;
    } catch (error) {
      console.error("Failed to create  logs:", error);
      throw error;
    }
  },

  getAllUsers: async (params?: URLSearchParams) => {
    try {
      const response = await axiosInstance.get<Pagination<UserItem>>("/UserDetails/getAllUsers", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to get all users data:", error);
      throw error;
    }
  },

  getUsersFromAD: async (userName: string) => {
    try {
      const response = await axiosInstance.get("/Auth/checkUser", { params: { userName } });
      return response.data;
    } catch (error) {
      toastError("Failed to get users from Active Directory: " + error)
      throw error;
    }
  },

  createUser: async (data: CreateUserType) => {
    try {
      const response = await axiosInstance.post("/UserDetails/createUser", data);
      return response.data;
    } catch (error) {
      toastError("Failed to create user: " + error);
      throw error;
    }
  },

  editUser: async (data: EditUser, id: number) => {
    try {
      const response = await axiosInstance.put(`/UserDetails/updateUser/${id}`, data);
      return response.data;
    } catch (error) {
      toastError("Failed to update user: " + error)
      throw error;
    }
  },

  getAllClusterHeads: async () => {
    try {
      const response = await axiosInstance.get("/UserDetails/getClusterHeads");
      return response.data;
    } catch (error) {
      toastError("Failed to get all cluster heads: " + error)
      throw error;
    }
  },

  getAllRoleTitles: async (params?: URLSearchParams) => {
    try {
      const response = await axiosInstance.get<Pagination<RoleTitleItem>>("/UserRole/getAllRoles", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to get all role titles data:", error);
      throw error;
    }
  },

  createRoleTitle: async (roleName: string) => {
    try {
      const response = await axiosInstance.post("/UserRole/createRole", { roleName });
      return response.data;
    } catch (error) {
      toastError("Failed to create role title: " + error);
      throw error;
    }
  },

  editRoleTitle: async (data: RoleTitleItem) => {
    try {
      const response = await axiosInstance.put(`/UserRole/updateRole/${data.id}`, data);
      return response.data;
    } catch (error) {
      toastError("Failed to update role title: " + error);
      throw error;
    }
  },

  deleteRoleTitle: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/UserRole/deleteRole/${id}`, { data: { id } });
      return response.data;
    } catch (error) {
      toastError("Failed to delete role title: " + error);
      throw error;
    }
  },

};
