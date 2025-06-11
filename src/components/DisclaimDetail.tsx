import { useLocation, useNavigate, useParams } from "react-router-dom";
import MainLayout from "./MainLayout";
import { CustomBreadcrumb } from "./custom-breadcrumb";
import { CheckCircle2, Flag as FlagIcon, X } from "lucide-react";
import { getStatusColor } from "./columns";
import { cn, createLogs } from "@/lib/utils";
import { DeleteDisclaimerDialog } from "./DeleteDisclaimerDialog";
import { useEffect, useRef, useState } from "react";
import { wealthService } from "@/services/wealthService";
import { toast, Toaster } from "sonner";
import { formatDate } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

const MAX_HEIGHT = 200;
export default function DisclaimDetail() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const { user } = useAuth();
  console.log(state.data);
  const item = state.data.find((item: any) => item.id == id);
  console.log(item);
  const title = state.data.find((item: any) => item.id == id).title || "";
  const type = state.data.find((item: any) => item.id == id).type || "";
  const status = state.data.find((item: any) => item.id == id).status || "";
  const template = state.data.find((item: any) => item.id == id).template || "";
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef(null);
  interface Event {
    disclosureId: string;
    actionType: string;
    timeStamp: string;
  }

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setShowButton(contentHeight > MAX_HEIGHT);
    }
  }, [template]);

  const fetchEvents = async () => {
    const data = await wealthService.getAllLogs();
    const logs = data
      .filter((item) => item.disclosureId == id)
      .sort(
        (a, b) =>
          new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
      );
    console.log(logs);

    setEvents(logs);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const effectiveDate =
    state.data.find((item: any) => item.id == id).effectivityDate || "";
  const navigate = useNavigate();
  const handleConfirmDel = async () => {
    try {
      const data = await wealthService.deleteDisclosureById(id);

      if (data || data.status.toString().includes("20")) {
        createLogs("", user, "Delete");
        toast.custom(
          (t) => (
            <div className="relative flex items-start gap-3 bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] min-w-[320px]">
              <div className="flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-base">
                  Deletion Request Submitted
                </h3>
                <p className="text-gray-500">
                  Your request to delete the disclosure has been successfully
                  submitted for approval. The item has been temporarily removed
                  from the view and is pending action from the checker. You will
                  be notified once the request is approved or rejected.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  toast.dismiss(t);
                }}
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
        await new Promise((resolve) => setTimeout(resolve, 5000));
        navigate("/admin");
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const handleDuplicate = async () => {
    console.log("item", item);
    navigate(`/admin/edit/${id}`, {
      state: {
        toEditDisclaimer: item,
        isEdit: false,
        data: state.data,
        isCopy: true,
      },
    });
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <MainLayout isAdmin={true} isApproval={false} isAudit={true}>
        <div className="p-6 bg-white">
          <CustomBreadcrumb
            variant="back"
            items={[{ label: "Back to Disclosures", href: "/admin" }]}
          />
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{`${id} ${title}`}</h1>
              <span
                className={cn(
                  "px-2 py-1 rounded text-sm",
                  getStatusColor(status)
                )}
              >
                {status}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="text-red-500 flex items-center gap-2"
                onClick={handleDuplicate}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Duplicate
              </button>

              {status === "Draft" || status === "Scheduled" ? (
                <>
                  <button
                    className="text-[#FF4647] border border-[#FF4647] rounded-full px-4 py-2 flex items-center gap-2"
                    onClick={handleDelete}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>

                  <button
                    className="bg-[#FF4647] text-white rounded-full px-4 py-2 flex items-center gap-2"
                    onClick={() => {
                      navigate(`/admin/edit/${id}`, {
                        state: {
                          toEditDisclaimer: item,
                          isEdit: true,
                          data: state.data,
                        },
                      });
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="min-h-screen  p-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm text-gray-600 mb-1 font-bold">
                      Type
                    </h2>
                    <p className="font-medium">{type}</p>
                  </div>

                  <div>
                    <h2 className="text-sm text-gray-600 mb-1 font-bold">
                      Effective Date
                    </h2>
                    <p className="font-medium">
                      {new Date(effectiveDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm text-gray-600 mb-1 font-bold">
                      Disclaimer Text
                    </h2>
                    {/* <div
                    className="space-y-4"
                    dangerouslySetInnerHTML={{ __html: template }}
                  ></div> */}
                  </div>

                  <div className="relative">
                    <div
                      ref={contentRef}
                      className={`space-y-4 overflow-hidden transition-all duration-300`}
                      style={{
                        maxHeight: isExpanded ? "100%" : `${MAX_HEIGHT}px`,
                      }}
                      dangerouslySetInnerHTML={{ __html: template }}
                    />

                    {!isExpanded && showButton && (
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
                    )}

                    {showButton && (
                      <button
                        className="text-red-500 flex items-center mt-2"
                        onClick={() => setIsExpanded(!isExpanded)}
                      >
                        <span>{isExpanded ? "See less" : "See more"}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ml-1 transform transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Tasks & events</h2>
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-[12px] top-7 h-[calc(100%-75px)] w-[1px] bg-gray-200"></div>

                    {/* <div className="mb-8">
                      <div className="flex gap-3">
                        <div className="relative">
                          <FlagIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            General Disclosure Rejected
                          </h3>
                          <p className="text-sm text-gray-500">
                            mm/dd/yy, h:mm AM
                          </p>
                          <div className="mt-2 bg-gray-50 rounded-md p-4">
                            <p className="text-gray-600">
                              This is a sample rejection notes. This is a sample
                              rejection notes. This is a sample rejection notes.
                              This is a sample rejection notes.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    {events &&
                      events.map((event) => (
                        <div>
                          <div className="flex gap-3 mt-2">
                            <div className="relative">
                              <FlagIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="font-medium">
                                {type} Disclosure {event?.actionType}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {event?.timeStamp &&
                                  formatDate(
                                    new Date(event?.timeStamp),
                                    "MM/dd/yyyy, h:mm a"
                                  )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DeleteDisclaimerDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onConfirm={() => {
              handleConfirmDel();
              // navigate("/admin", {
              //   state: {
              //     updatedData: state.data.filter((item: any) => item.id !== id),
              //   },
              // });
            }}
            onCancel={() => setShowDeleteDialog(false)}
          />
        </div>
      </MainLayout>
    </>
  );
}
