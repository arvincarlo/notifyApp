import MainLayout from "@/components/MainLayout";
import { RadioButton } from "@/components/RadioButton";
import { wealthService } from "@/services/wealthService";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { createLogsForParameter } from "@/lib/utils";
interface BookingUnit {
  id: string;
  name: string;
  uid?: string;
  displayPreference: "Display All" | "Display Wealth Only" | "Do not Display";
}

function NotificationBar({ onCancel, onSave, isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className=" bg-white border-t border-gray-200 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-red-500 border border-red-500 rounded-full hover:bg-red-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              Save
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const Parameter = () => {
  const [showNotification, setShowNotification] = useState(false);
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : "null";
  const [bookingUnits, setBookingUnits] = useState<BookingUnit[]>([
    { id: "fcbs", name: "FCBS", displayPreference: "Display All" },
    { id: "trust", name: "Trust", displayPreference: "Display Wealth Only" },
    {
      id: "treasury",
      name: "Treasury",
      displayPreference: "Display Wealth Only",
    },
    { id: "cbsec", name: "CBSec", displayPreference: "Display Wealth Only" },
  ]);
  const [isChangesVisible, setIsChangesVisible] = useState(false);
  const [showChangeInfo, setShowChangeInfo] = useState(false);
  const originalBookingUnitsRef = useRef<BookingUnit[]>([]);
  const [pendingBookingUnits, setPendingBookingUnits] = useState<BookingUnit[]>(
    []
  );

  // const originalBookingUnitsRef = useRef([]);

  const convertDisplayPreference = (item: any) => {
    if (item.displayAll) return "Display All";
    if (item.displayWealthOnly) return "Display Wealth Only";
    if (item.doNotDisplay) return "Do not Display";
    return "";
  };

  const fetchAllDefaultParamters = async () => {
    const data = await wealthService.getAllParametersByStatus("Default");
    const updatedBookingUnits = data.map((item) => ({
      id: item.bookingUnit.toLowerCase(),
      name: item.bookingUnit,
      uid: item.id,
      displayPreference: convertDisplayPreference(item),
    }));
    setBookingUnits(updatedBookingUnits);
  };

  const fetchAllPendingParamters = async () => {
    const data = await wealthService.getAllParametersByStatus("pending");
    const updatedBookingUnits = data.map((item) => ({
      id: item.bookingUnit?.toLowerCase() || "",
      name: item.bookingUnit,
      uid: item.id,
      displayPreference: convertDisplayPreference(item),
    }));
    setPendingBookingUnits(updatedBookingUnits);
  };

  const fetchAllParamters = async () => {
    const data = await wealthService.getAllParameters();
    console.log("data", data);
  };

  useEffect(() => {
    fetchAllDefaultParamters();
    fetchAllPendingParamters();
  }, []);

  const getChangedUnits = () => {
    return pendingBookingUnits?.filter((currentUnit) => {
      const originalUnit = bookingUnits?.find(
        (unit) => unit.name === currentUnit.name
      );
      return (
        originalUnit &&
        originalUnit.displayPreference !== currentUnit.displayPreference
      );
    });
  };

  const handlePreferenceChange = (
    unitId: string,
    preference: BookingUnit["displayPreference"]
  ) => {
    setBookingUnits((units) =>
      units.map((unit) =>
        unit.id === unitId ? { ...unit, displayPreference: preference } : unit
      )
    );
    setShowNotification(true);
    setShowChangeInfo(false);
    setIsChangesVisible(false);
  };

  const handleCancel = () => {
    // Reset changes and hide notification
    fetchAllDefaultParamters();
    // setShowNotification(false);
  };

  const handleSave = async () => {
    try {
      const originalBookingUnit = await wealthService.getAllParametersByStatus(
        "Default"
      );
      const originalBookingUnitCopy = originalBookingUnit.map((item) => ({
        id: item.bookingUnit.toLowerCase(),
        name: item.bookingUnit,
        uid: item.id,
        displayPreference: convertDisplayPreference(item),
      }));
      const changedItems: {
        uid: any;
        bookingUnit: any;
        displayPreference:
          | "Display All"
          | "Display Wealth Only"
          | "Do not Display";
      }[] = [];
      originalBookingUnitCopy.forEach((originalItem) => {
        const newItem = bookingUnits.find(
          (item) => item.id === originalItem.id
        );

        if (
          newItem &&
          JSON.stringify(originalItem.displayPreference) !==
            JSON.stringify(newItem.displayPreference)
        ) {
          changedItems.push({
            uid: originalItem.uid,
            bookingUnit: originalItem.name,
            displayPreference: newItem.displayPreference,
          });
        }
      });

      // const data1 = await wealthService.getAllParameters();
      // const updatedBookingUnits = data1.map((item) => ({
      //   id: item.bookingUnit.toLowerCase(),
      //   name: item.bookingUnit,
      //   uid: item.id,
      //   displayPreference: convertDisplayPreference(item),
      // }));
      // originalBookingUnitsRef.current = JSON.parse(
      //   JSON.stringify(updatedBookingUnits)
      // );
      const postBodies = changedItems.map((item) => ({
        bookingUnit: item.bookingUnit,
        displayAll: item.displayPreference == "Display All",
        displayWealthOnly: item.displayPreference == "Display Wealth Only",
        doNotDisplay: item.displayPreference == "Do not Display",
        lastModified: new Date().toISOString(),
      }));

      // const updatePromises = postBodies.map(
      //   async (body) => await wealthService.editParameterById(changedItems)
      // );
      // const data = await Promise.all(updatePromises);
      // console.log("data", data);
      const updatePromises = postBodies.map(
        async (body) => await wealthService.editParameterStatus(body)
      );
      updatePromises.push(await createLogsForParameter(user));
      const data = await Promise.all(updatePromises);
      if (data) {
        setShowChangeInfo(true);

        toast.custom(
          (t) => (
            <div className="relative flex items-start gap-3 bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] min-w-[320px]">
              <div className="flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-base">
                  {"Parameter have been saved"}
                </h3>
                <p className="text-gray-500">
                  {
                    "Your parameter settings have been saved successfully. Changes will take effect once they have been reviewed and approved."
                  }
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.dismiss(t)}
                className="z-100000 absolute right-2 top-2 p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none"
                aria-label="Close notification"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ),
          {
            duration: 5000,
            position: "top-right",
          }
        );
        await fetchAllDefaultParamters();
        await fetchAllPendingParamters();
      }
      setShowNotification(false);
    } catch (error) {
      console.error("Failed to save parameters:", error);
      toast.error("Save parameters failed");
    }
  };

  console.log("pendingBookingUnits", pendingBookingUnits);
  console.log("defaultParamters", bookingUnits);
  console.log("pendingBookingUnits", pendingBookingUnits.length);
  return (
    <MainLayout isAdmin={true} isApproval={false} isAudit={true}>
      <Toaster richColors position="top-right" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Parameter Maintenance</h1>

        <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_4px_0px_rgba(0,0,0,0.05)]">
          <h2 className="text-lg font-semibold mb-2">
            Select Display Preference for Wealth Products
          </h2>
          <p className="text-gray-600 mb-4">
            Allow you to define how wealth and non-wealth products are displayed
            within the system. You can choose from the following settings:
          </p>

          <div className="mb-6">
            <p className="mb-1">
              <span className="font-semibold">Display All –</span> Show both
              wealth and non-wealth products.
            </p>
            <p>
              <span className="font-semibold">Display Wealth Only –</span> Show
              only products tagged as wealth.
            </p>
          </div>

          {(showChangeInfo || pendingBookingUnits.length > 0) && (
            <div className="mb-6 bg-[#FDF6ED] rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="text-amber-500">⚠</div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Parameter changes is pending approval
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Changes to the parameter maintenance are now pending
                    approval. The current settings will remain in effect until
                    the new changes are reviewed and approved.
                  </p>
                  <button
                    className="flex items-center text-amber-600 hover:text-amber-700 font-medium"
                    onClick={() => setIsChangesVisible(!isChangesVisible)}
                  >
                    <span className="border-b border-amber-600">
                      {!isChangesVisible ? "View Changes" : "Show Less"}
                    </span>
                    {isChangesVisible ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isChangesVisible && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 border-t border-amber-200 pt-4 space-y-4">
                          {getChangedUnits().map((currentUnit) => {
                            const originalUnit = bookingUnits.find(
                              (unit) => unit.name === currentUnit.name
                            );

                            return (
                              <div
                                key={currentUnit.id}
                                className="flex items-start"
                              >
                                <div className="w-24 font-medium mt-1">
                                  {currentUnit.name}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <div>
                                      <div className="text-sm text-gray-500 mb-1">
                                        Current Value
                                      </div>
                                      <div className="text-gray-900">
                                        {originalUnit?.displayPreference}
                                      </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400 mt-4 font-bold" />
                                    <div>
                                      <div className="text-sm text-gray-500 mb-1">
                                        New Value
                                      </div>
                                      <div className="text-gray-900">
                                        {currentUnit.displayPreference}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[14px] font-normal text-gray-500">
                    Booking Unit
                  </th>
                  <th className="px-6 py-3 text-center text-[14px] font-normal text-gray-500">
                    Display All
                  </th>
                  <th className="px-6 py-3 text-center text-[14px] font-normal text-gray-500">
                    Display Wealth Only
                  </th>
                  <th className="px-6 py-3 text-center text-[14px] font-normal text-gray-500">
                    Do not Display
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {bookingUnits.map((unit) => (
                  <tr key={unit.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {unit.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <RadioButton
                        checked={unit.displayPreference === "Display All"}
                        onChange={() =>
                          handlePreferenceChange(unit.id, "Display All")
                        }
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <RadioButton
                        checked={
                          unit.displayPreference === "Display Wealth Only"
                        }
                        onChange={() =>
                          handlePreferenceChange(unit.id, "Display Wealth Only")
                        }
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <RadioButton
                        checked={unit.displayPreference === "Do not Display"}
                        onChange={() =>
                          handlePreferenceChange(unit.id, "Do not Display")
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <NotificationBar
            isVisible={showNotification}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        </div>
      </div>
    </MainLayout>
  );
};
