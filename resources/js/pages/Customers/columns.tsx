import { ColumnDef } from '@tanstack/react-table';
import { Customer } from '@/types';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, GripVertical, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

export const columns = (
    onEdit: (customer: Customer) => void,
    onDelete: (customer: Customer) => void
): ColumnDef<Customer>[] => [
    {
        id: 'drag',
        header: ({ table }) => (
            <span className="sr-only">Drag handle</span>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center text-muted-foreground">
                <GripVertical className="h-4 w-4" />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-4"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('phone')}</div>,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-4"
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'address',
        header: 'Address',
        cell: ({ row }) => <div className="max-w-[300px] truncate text-muted-foreground" title={row.getValue('address')}>{row.getValue('address')}</div>,
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const c = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(c.phone)}>
                            Copy phone number
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(c)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit customer
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => onDelete(c)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete customer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
