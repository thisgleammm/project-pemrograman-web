import { ColumnDef } from '@tanstack/react-table';
import { Sparepart } from '@/types';
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
import { Badge } from '@/components/ui/badge';

export const columns = (
    onEdit: (sparepart: Sparepart) => void,
    onDelete: (sparepart: Sparepart) => void
): ColumnDef<Sparepart>[] => [
    {
        id: 'drag',
        header: () => (
            <span className="sr-only">Drag handle</span>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'sku',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-4"
                >
                    SKU
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue('sku')}</div>,
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
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
            const price = parseFloat(row.getValue('price'));
            const formatted = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(price);
            return <div>{formatted}</div>;
        },
    },
    {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }) => {
            const stock = row.getValue('stock') as number;
            const minStock = row.getValue('min_stock') as number;

            if (stock <= minStock) {
                return (
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-destructive">{stock}</span>
                        <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                            Low Stock
                        </Badge>
                    </div>
                );
            }

            return <div>{stock}</div>;
        },
    },
    {
        accessorKey: 'min_stock',
        header: 'Min Stock',
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('min_stock')}</div>,
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const s = row.original;
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(s.sku)}>
                            Copy SKU
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(s)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Sparepart
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => onDelete(s)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Sparepart
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
