import { ColumnDef } from '@tanstack/react-table';
import { Vehicle } from '@/types';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

export const columns = (
    onEdit: (vehicle: Vehicle) => void,
    onDelete: (vehicle: Vehicle) => void
): ColumnDef<Vehicle>[] => [
    {
        id: 'drag',
        header: () => (
            <span className="sr-only">Drag handle</span>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'plate_no',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-4"
                >
                    Plate No
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue('plate_no')}</div>,
    },
    {
        accessorKey: 'customer.name',
        header: 'Owner',
        cell: ({ row }) => <div className="text-muted-foreground">{row.original.customer?.name}</div>,
    },
    {
        accessorKey: 'brand',
        header: 'Brand',
        cell: ({ row }) => <div>{row.getValue('brand')}</div>,
    },
    {
        accessorKey: 'model',
        header: 'Model',
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('model')}</div>,
    },
    {
        accessorKey: 'year',
        header: 'Year',
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('year')}</div>,
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const v = row.original;
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(v.plate_no)}>
                            Copy Plate No
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(v)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Vehicle
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => onDelete(v)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Vehicle
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
