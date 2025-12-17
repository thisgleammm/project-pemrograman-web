import { Booking } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Clock, PlayCircle, Check, X } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

export const columns = (
    onEdit: (booking: Booking) => void,
    onDelete: (booking: Booking) => void,
    onStatusChange: (booking: Booking, newStatus: string) => void
): ColumnDef<Booking>[] => [
    {
        id: 'drag',
        header: () => (
            <span className="sr-only">Drag handle</span>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'date',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-4"
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div>{format(new Date(row.getValue('date')), 'dd MMM yyyy')}</div>;
        },
    },
    {
        accessorKey: 'user.name',
        header: 'Customer',
        cell: ({ row }) => {
            const user = row.original.user;
            return <div className="font-medium">{user?.name || 'N/A'}</div>;
        },
    },
    {
        accessorKey: 'vehicle.plate_no',
        header: 'Vehicle',
        cell: ({ row }) => {
            const vehicle = row.original.vehicle;
            return (
                <div>
                    <div className="font-medium">{vehicle?.plate_no}</div>
                    <div className="text-xs text-muted-foreground">{vehicle?.brand} {vehicle?.model}</div>
                </div>
            );
        },
    },
    {
        accessorKey: 'complaint',
        header: 'Complaint',
        cell: ({ row }) => <div className="max-w-[300px] truncate text-muted-foreground" title={row.getValue('complaint')}>{row.getValue('complaint')}</div>,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            
            let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
            let colorClass = '';

            switch (status) {
                case 'pending':
                    variant = 'secondary';
                    colorClass = 'bg-yellow-500/15 text-yellow-700 border-yellow-500/20 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-500/30';
                    break;
                case 'in_progress':
                    variant = 'outline';
                    colorClass = 'bg-blue-500/15 text-blue-700 border-blue-500/20 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-500/30';
                    break;
                case 'completed':
                    variant = 'outline';
                    colorClass = 'bg-green-500/15 text-green-700 border-green-500/20 dark:bg-green-900/30 dark:text-green-400 dark:border-green-500/30';
                    break;
                case 'cancelled':
                    variant = 'destructive';
                    colorClass = 'bg-red-500/15 text-red-700 border-red-500/20 dark:bg-red-900/30 dark:text-red-400 dark:border-red-500/30';
                    break;
            }

            return (
                <Badge variant={variant} className={`capitalize ${colorClass}`}>
                    {status.replace('_', ' ')}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const booking = row.original;
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booking.complaint)}>
                            Copy complaint
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                Change Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => onStatusChange(booking, 'pending')}>
                                    <Clock className="mr-2 h-4 w-4" />
                                    Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onStatusChange(booking, 'in_progress')}>
                                    <PlayCircle className="mr-2 h-4 w-4" />
                                    In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onStatusChange(booking, 'completed')}>
                                    <Check className="mr-2 h-4 w-4" />
                                    Completed
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    onClick={() => onStatusChange(booking, 'cancelled')}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Cancelled
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuItem onClick={() => onEdit(booking)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit booking
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => onDelete(booking)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete booking
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
