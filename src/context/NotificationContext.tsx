import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const approvalsList = [
    {
        id: "1",
        activityType: "Parameter Maintenance",
        requestedBy: {
            name: "Leslie Alexander",
            role: "Admin Maker - PM",
        },
        status: "Pending",
        lastModified: "30 Oct 2024 15:00",
    },
    {
        id: "2",
        activityType: "Disclosures",
        requestedBy: {
            name: "Kristin Watson",
            role: "Admin Maker - DN",
        },
        status: "Pending",
        lastModified: "30 Oct 2024 15:00",
    },
    {
        id: "3",
        activityType: "Disclosures",
        requestedBy: {
            name: "Leslie Alexander",
            role: "Admin Maker - DN",
        },
        status: "Pending",
        lastModified: "30 Oct 2024 15:00",
    },
    {
        id: "4",
        activityType: "Disclosures",
        requestedBy: {
            name: "Kristin Watson",
            role: "Admin Maker - DN",
        },
        status: "Pending Deletion",
        lastModified: "30 Oct 2024 15:00",
    },
    {
        id: "5",
        activityType: "Parameter Maintenance",
        requestedBy: {
            name: "Leslie Alexander",
            role: "Admin - AP-C",
        },
        status: "Rejected",
        lastModified: "30 Oct 2024 15:00",
    },
    {
        id: "6",
        activityType: "Disclosures",
        requestedBy: {
            name: "Kristin Watson",
            role: "Admin Maker - DN",
        },
        status: "Lapsed",
        lastModified: "30 Oct 2024 15:00",
    },
    {
        id: "7",
        activityType: "Disclosures",
        requestedBy: {
            name: "Kristin Watson",
            role: "Admin Maker - DN",
        },
        status: "Approved",
        lastModified: "30 Oct 2024 15:00",
    },
    {
        id: "8",
        activityType: "Disclosures",
        requestedBy: {
            name: "Kristin Watson",
            role: "Admin Maker - DN",
        },
        status: "Approved",
        lastModified: "30 Oct 2024 15:00",
    },
    {
        id: "9",
        activityType: "Disclosures1",
        requestedBy: {
            name: "Kristin Watson",
            role: "Admin Maker - DN",
        },
        status: "Approved",
        lastModified: "30 Oct 2024 15:00",
    },
    {
        id: "10",
        activityType: "Disclosures2",
        requestedBy: {
            name: "Kristin Watson",
            role: "Admin Maker - DN",
        },
        status: "Approved",
        lastModified: "30 Oct 2024 15:00",
    },
    {
        id: "11",
        activityType: "Disclosures2",
        requestedBy: {
            name: "Kristin Watson",
            role: "Admin Maker - DN",
        },
        status: "Approved",
        lastModified: "30 Oct 2024 15:00",
    },
    {
        id: "11",
        activityType: "Disclosures2",
        requestedBy: {
            name: "Kristin Watson",
            role: "Admin Maker - DN",
        },
        status: "Approved",
        lastModified: "30 Oct 2024 15:00",
    },
];

type Approvals = {
    id: string;
    activityType: string;
    requestedBy: {
        name: string;
        role: string;
    };
    status: string;
    lastModified: string;
};

type NotificationContextType = {
    notifications: Approvals[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [approvals, setApprovals] = useState<Approvals[]>([]);
    const [notifications,setNotifications] = useState(0);

    useEffect(() => {
        if (approvalsList) setApprovals(approvalsList);
    }, [])

    // const [unreadCount, setUnreadCount] = useState(0);

    // const addNotification = (notification) => {
    //     setNotifications((prev) => [...prev, notification]);
    //     setUnreadCount((prev) => prev + 1);
    // };

    // const markAsRead = (id) => {
    //     setNotifications((prev) =>
    //     prev.map((notif) =>
    //         notif.id === id ? { ...notif, read: true } : notif
    //     )
    //     );
    //     setUnreadCount((prev) => prev - 1);
    // };

    return (
        <NotificationContext.Provider
            value={{ approvals, notifications }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

const useNotification = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }

    return context;
}

export { NotificationProvider, useNotification };