import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { SELECTED_USER } from "@/constant/sysAdmin"
import { cn } from "@/lib/utils"
import { wealthService } from "@/services/wealthService"
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { useDebounce } from "use-debounce"

interface Props {
    value: string;
    onSelect: (value: typeof SELECTED_USER) => void;
}

export function SearchUser({ value, onSelect }: Props) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [users, setUsers] = useState<typeof SELECTED_USER[]>([])
    const [isPending, startTransition] = useTransition()

    const [debouncedSearchValue] = useDebounce(searchValue, 300)

    useEffect(() => {
        startTransition(() => {
            const fetchUsers = async () => {
                const response = await wealthService.getUsersFromAD(debouncedSearchValue)
                setUsers(response)
            }

            if (debouncedSearchValue) fetchUsers()
            else setUsers([])
        })
    }, [debouncedSearchValue])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? value
                        : "Search Username"
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput
                        id="search-user"
                        value={searchValue}
                        onValueChange={setSearchValue} />
                    <CommandList>
                        {debouncedSearchValue &&
                            <CommandEmpty>
                                {isPending ?
                                    <LoaderCircle className="mr-3 size-5 animate-spin mx-auto w-full" /> :
                                    "No users found."
                                }
                            </CommandEmpty>
                        }
                        <CommandGroup>
                            {searchValue && users.map((user) => (
                                <CommandItem
                                    key={user.userName}
                                    value={user.fullName}
                                    onSelect={() => {
                                        onSelect(user)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === user.fullName ?
                                                "opacity-100" :
                                                "opacity-0"
                                        )}
                                    />
                                    {user.fullName}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
