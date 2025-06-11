import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toastError, toastSuccess } from "@/lib/utils";
import { createRoleTitleSchema } from "@/schemas/sysAdmin";
import { wealthService } from "@/services/wealthService";
import { RoleTitleItem } from "@/types/systemAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { ControllerRenderProps, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
    isEdit?: boolean;
    roleTitle?: RoleTitleItem;
    onRoleTitleCreate: () => void;
}

const CreateRoleTitle = ({ isEdit = false, roleTitle, onRoleTitleCreate }: Props) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const form = useForm<z.infer<typeof createRoleTitleSchema>>({
        resolver: zodResolver(createRoleTitleSchema),
        defaultValues: {
            id: roleTitle?.id.toString() || "",
            roleName: roleTitle?.roleName || "",
        },
    });

    const onSubmit: SubmitHandler<z.infer<typeof createRoleTitleSchema>> = async (data) => {
        let response;

        if (isEdit && roleTitle) {
            response = await wealthService.editRoleTitle({ ...data, id: roleTitle?.id });
        } else {
            response = await wealthService.createRoleTitle(data.roleName);
        }

        if (!(response instanceof AxiosError)) {
            setIsSheetOpen(false);
            form.reset();
            onRoleTitleCreate();
            toastSuccess(`Role Title ${isEdit ? "updated" : "created"} successfully`);
        } else {
            toastError(`Error ${isEdit ? "updating" : "creating"} role title: ${response.message}`);
        }
    }

    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                {
                    isEdit ? (
                        <span>{roleTitle?.id}</span>
                    ) : (
                        <Button
                            className={
                                "whitespace-nowrap rounded-[50px] bg-[#FF4647] hover:bg-[#FF4647]/90 text-white"
                            }
                        >
                            <Plus className=" h-5 w-5" />
                            Add Role Title
                        </Button>
                    )
                }
            </SheetTrigger>
            <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px] p-0 rounded-l-2xl">
                <SheetHeader className="p-6 bg-red-500 text-white rounded-tl-2xl relative">
                    <SheetTitle
                        className="text-white text-xl font-normal"
                    >
                        {isEdit ? "Edit Role Title" : "Add New Role Title"}
                    </SheetTitle>
                    <SheetDescription className="text-slate-200">
                        Fields with * are required
                    </SheetDescription>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-2 text-white h-8 w-8 hover:bg-transparent hover:text-white"
                        onClick={() => setIsSheetOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </SheetHeader>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pt-4">
                        <div className="mt-5">
                            <FormField
                                control={form.control}
                                name="roleName"
                                render={({ field }: { field: ControllerRenderProps<z.infer<typeof createRoleTitleSchema>, "roleName"> }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Role Name *
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <SheetFooter className="my-7">
                            <SheetClose asChild>
                                <Button variant="secondary">
                                    Cancel
                                </Button>
                            </SheetClose>
                            <Button type="submit">Save</Button>
                        </SheetFooter>
                    </form>
                </FormProvider>
            </SheetContent>
        </Sheet>
    )
}

export default CreateRoleTitle