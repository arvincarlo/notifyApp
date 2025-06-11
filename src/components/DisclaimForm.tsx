import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TiptapEditor } from "./TiptapEditor";
import {
  CalendarIcon,
  CheckCircle2,
  Eye,
  EyeIcon,
  SaveIcon,
  SendHorizonalIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { cn, convertToISOString } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { PreviewPdfModal } from "./PreviewPdf";
import { DatePicker } from "./DatePicker";
import { DeleteDisclaimerDialog } from "./DeleteDisclaimerDialog";
import { wealthService } from "@/services/wealthService";
import { useAuth } from "@/hooks/useAuth";
import { toast, Toaster } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["General", "Marketing", "Announcement"]),
  // validityDate: z.object({
  //   from: z.date({
  //     required_error: "Start date is required",
  //   }),
  //   to: z.date({
  //     required_error: "End date is required",
  //   }),
  // }),
  // effectivityDate: z.string().min(1, "Effectivity date is required"),
  // validateDate: z.string().min(1, "Effectivity date is required"),
  effectivityDate: z.string(),
  validateDate: z.string(),
  disclaimerText: z.string().min(1, "Disclaimer text is required"),
});
interface ToEditClaimer {
  template: string | undefined;
  validUntil: string | undefined;
  id: string;
  title: string;
  type: "Announcement" | "Marketing" | "General";
  disclaimerText: string;
  effectivityDate: string;
  validateDate?: string;
  // validity: {
  //   start: string;
  //   end: string;
  // };
}

export const DisclaimForm = ({
  toEditClaimer,
  isEdit,
  data,
  type,
  isCopy = false,
}: {
  toEditClaimer?: ToEditClaimer;
  isEdit: boolean;
  data?: any;
  type?: "Announcement" | "Marketing" | "General";
  isCopy?: boolean;
}) => {
  const { user } = useAuth();
  const [openCancel, setOpenCancel] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const navigate = useNavigate();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [errorEffectivDate, setErrorEffectiveDate] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "General",
      disclaimerText: "",
      effectivityDate: format(new Date(), "dd MMM yyyy"),
      validateDate: format(new Date(), "dd MMM yyyy"),
      // validityDate: {
      //   from: new Date(),
      //   to: addDays(new Date(), 30), // Default to 30 days range
      // },
    },
    // mode: "onChange",
  });

  useEffect(() => {
    if (toEditClaimer) {
      console.log("toEditClaimer", toEditClaimer);
      form.reset({
        title: toEditClaimer.title,
        type: toEditClaimer.type || type,
        disclaimerText: toEditClaimer.template,
        // validityDate: {
        //   from: new Date(toEditClaimer.validity.start),
        //   to: new Date(toEditClaimer.validity.end),
        // },
        validateDate: `${toEditClaimer.validUntil}`,
        effectivityDate: toEditClaimer.effectivityDate,
      });
    } else {
      form.reset({
        type: type,
        validateDate: format(new Date(), "dd MMM yyyy"),
      });
    }
  }, [form, toEditClaimer]);

  const successCreate = async (body: any, save: boolean) => {
    try {
      const body1 =
        toEditClaimer && !isCopy ? { ...body, id: toEditClaimer.id } : body;
      const data =
        toEditClaimer && !isCopy
          ? await wealthService.editDisclosureById(body1, toEditClaimer.id)
          : await wealthService.createDisclosure(body1);

      if (data || data.status.toString().includes("20")) {
        toast.custom(
          (t) => (
            <div className="relative flex items-start gap-3 bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] min-w-[320px]">
              <div className="flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-base">
                  {save ? "Saved Successfully" : "Success"}
                </h3>
                <p className="text-gray-500">
                  {save
                    ? "Your disclosure has been saved as a draft. You can continue editing or submit it for approval when ready."
                    : "Your disclosure has been successfully created and is now pending approval.You will be notified once it is reviewed and approved."}
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
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const newData = await wealthService.getAllDisclosures();
        const logs = await wealthService.getAllLogs();
        const logBody = {
          id: logs.length === 0 ? 0 : logs.length + 1,
          disclosureId: toEditClaimer
            ? `${toEditClaimer.id}`
            : `${newData[newData.length - 1].id}`,
          user: user?.name,
          userId: user?.id,
          activityType: "Discalimer&Notices",
          actionType: toEditClaimer ? "Update" : "Create",
          timeStamp: new Date().toISOString(),
        };

        await wealthService.createLogs(logBody);
        navigate("/admin", {
          state: { updatedData: newData },
        });
      }
    } catch (e) {
      //show error message
      toast.error("Create disclosure failed");
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values", values);
    const body = {
      title: values.title,
      type: values.type,
      effectivityDate: values.effectivityDate.includes("Z")
        ? values.effectivityDate
        : new Date(values.effectivityDate).toISOString(),
      validUntil:
        values.type != "General"
          ? new Date(values.validateDate).toISOString()
          : values.effectivityDate.includes("Z")
          ? values.effectivityDate
          : new Date(values.effectivityDate).toISOString(),
      status: "Pending Approval",
      template: values.disclaimerText,
      createdBy: user?.name,
    };

    console.log("body", body);

    if (isEdit) {
      // Update existing disclaimer
      // const index = data.findIndex(
      //   (item: any) => item.id === toEditClaimer?.id
      // );
      // data[index] = {
      //   ...data[index],
      //   title: values.title,
      //   type: values.type,
      //   EffectivityDate: values.effectivityDate,
      // };
      // navigate("/admin", {
      //   state: { updatedData: data },
      // });
      successCreate(body, false);
    } else {
      successCreate(body, false);
    }
  }
  const saveAsDraft = async () => {
    const values = form.getValues(); // Get current form values
    console.log("values", values);
    const body = {
      title: values.title,
      type: values.type,
      effectivityDate: values.effectivityDate.includes("Z")
        ? values.effectivityDate
        : new Date(values.effectivityDate).toISOString(),
      validUntil:
        values.type != "General"
          ? values.validateDate.includes("Z")
            ? values.validateDate
            : new Date(values.validateDate).toISOString()
          : values.effectivityDate.includes("Z")
          ? values.effectivityDate
          : new Date(values.effectivityDate).toISOString(),
      status: "Draft", // Set status to draft
      template: values.disclaimerText,
      createdBy: user?.name,
    };
    console.log("body", body);
    successCreate(body, true);
  };
  const handlePreview = (): void => {
    setIsPreviewOpen(true);
  };

  const handleCancel = () => {
    setOpenCancel(true);
  };

  console.log("form.formState.getValues", form.getValues());

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="flex justify-end -mt-2 mb-4">
        <button
          onClick={handlePreview}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm ${
            form.watch("disclaimerText")?.length > 1
              ? "text-[#FF4647]"
              : "text-gray-600"
          } bg-white rounded-md hover:bg-gray-50 transition-colors duration-200`}
        >
          <Eye
            className={`w-4 h-4 ${
              form.watch("disclaimerText")?.length > 1 ? "text-[#FF4647]" : ""
            }`}
          />
          Preview PDF
        </button>
      </div>
      <div className="p-6 bg-white rounded-xl shadow-[0_2px_8px_0px_rgba(0,0,0,0.08)]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 font-medium">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input className="rounded-lg border-gray-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 font-medium">
                    Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-lg border-gray-200 w-[300px]">
                        <SelectValue placeholder="General" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Announcement">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div
              className={cn(
                "flex gap-4 ",
                `${form.watch("type") != "General" ? "w-full" : "w-[300px]"}`
              )}
            >
              {/* Effective Date */}
              <FormField
                control={form.control}
                name="effectivityDate"
                render={({ field }) => (
                  <div className="flex-1 flex flex-col space-y-2">
                    <FormLabel className="text-gray-900 font-medium">
                      Effective Date
                    </FormLabel>
                    <DatePicker
                      className={cn(
                        "rounded-lg w-full",
                        errorEffectivDate
                          ? "border-[#FF4647]"
                          : "border-gray-200"
                      )}
                      // setCalendarOpen={setCalendarOpen}
                      // open={calendarOpen}
                      date={
                        new Date(field.value === "" ? new Date() : field.value)
                      }
                      isEdit={isEdit}
                      onDateChange={(date) => {
                        const formattedDate = format(date, "dd MMM yyyy");
                        console.log("formattedDate", formattedDate);

                        const dataFiltered = data
                          ?.filter((item) => item.status === "Active")
                          .map((item1) =>
                            format(
                              new Date(item1.effectivityDate),
                              "dd MMM yyyy"
                            )
                          );
                        const dataExists = dataFiltered.includes(formattedDate);

                        if (dataExists) {
                          setErrorEffectiveDate(true);
                          form.setError("effectivityDate", {
                            type: "manual",
                            message:
                              "⚠️ An active disclosure with the selected effective date already exists. Please choose a different effective date",
                          });
                        } else {
                          setErrorEffectiveDate(false);
                          form.clearErrors("effectivityDate");
                          field.onChange(formattedDate);
                        }

                        // field.onChange(new Date(date).toISOString);
                      }}
                    />
                    <FormMessage />
                  </div>
                )}
              />

              {/* Validate Date */}
              {form.watch("type") != "General" && (
                <FormField
                  control={form.control}
                  name="validateDate"
                  render={({ field }) => (
                    <div className="flex-1 flex flex-col space-y-2">
                      <FormLabel className="text-gray-900 font-medium">
                        Validate Date
                      </FormLabel>
                      <DatePicker
                        className="rounded-lg border-gray-200 w-full"
                        date={
                          new Date(
                            field.value === "" ? new Date() : field.value
                          )
                        }
                        onDateChange={(date) => {
                          console.log("date", date);
                          const formattedDate = format(date, "dd MMM yyyy");
                          field.onChange(formattedDate);
                        }}
                        open={false}
                        setCalendarOpen={undefined}
                      />
                      <FormMessage />
                    </div>
                  )}
                />
              )}
            </div>

            {/* Disclaimer Text */}
            <FormField
              control={form.control}
              name="disclaimerText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 font-medium">
                    Disclaimer Text
                  </FormLabel>
                  <FormControl>
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                      //   className="min-h-[200px] border rounded-lg"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-between items-center pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="text-[#FF4647] hover:bg-[#FF4647]/10 rounded-full px-6"
              >
                Cancel
              </Button>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={!form.formState.isValid}
                  onClick={saveAsDraft}
                  className={cn(
                    "flex gap-2 items-center rounded-full px-6 border border-[#FF4647] text-[#FF4647] hover:bg-[#FF4647]/10",
                    "disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed",
                    "hover:bg-[#FF4647]/90 disabled:hover:bg-gray-300"
                  )}
                >
                  <SaveIcon className="w-4 h-4" />
                  Save as draft
                </Button>
                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                  className={cn(
                    "rounded-full px-6 flex items-center gap-2 bg-[#FF4647] text-white",
                    "disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed",
                    "hover:bg-[#FF4647]/90 disabled:hover:bg-gray-300"
                  )}
                >
                  <SendHorizonalIcon className="w-4 h-4" />
                  Submit for approval
                </Button>
              </div>
            </div>
          </form>
        </Form>
        <PreviewPdfModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          content={{
            title: form.watch("title"),
            disclaimerText: form.watch("disclaimerText"),
          }}
        />
        <DeleteDisclaimerDialog
          open={openCancel}
          onOpenChange={setOpenCancel}
          onConfirm={() => {
            setOpenCancel(false);
          }}
          onCancel={() => {
            setOpenCancel(false);
            navigate("/admin");
          }}
          isEdit={isEdit}
          isCreate={!isEdit}
        />
      </div>
    </>
  );
};
