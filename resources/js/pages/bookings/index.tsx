import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';
import { Ziggy } from '@/ziggy';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Booking, BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { FormEventHandler, useState, useEffect, useCallback, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bookings',
        href: route('booking.index', undefined, undefined, Ziggy),
    },
];

interface IndexProps {
    bookings: Booking[];
}

export default function Index({ bookings }: IndexProps) {
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);

    // Edit Form
    const { data: editData, setData: setEditData, put: editPut, processing: editProcessing, errors: editErrors, reset: editReset, clearErrors: clearEditErrors } = useForm({
        date: '',
        complaint: '',
        status: '',
    });

    const editClearErrors = useCallback(() => {
        clearEditErrors();
    }, [clearEditErrors]);

    useEffect(() => {
        if (editingBooking) {
            setEditData({
                date: editingBooking.date,
                complaint: editingBooking.complaint,
                status: editingBooking.status,
            });
            editClearErrors();
        }
    }, [editingBooking, setEditData, editClearErrors]);

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingBooking) {
            editPut(route('booking.update', editingBooking.id, undefined, Ziggy), {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingBooking(null);
                    editReset();
                },
            });
        }
    };

    // Delete Action
    const { delete: destroy } = useForm();

    const confirmDelete = () => {
        if (deletingBooking) {
            destroy(route('booking.destroy', deletingBooking.id, undefined, Ziggy), {
                preserveScroll: true,
                onSuccess: () => setDeletingBooking(null),
            });
        }
    };

    // Status Change Handler
    const handleStatusChange = useCallback((booking: Booking, newStatus: string) => {
        router.put(route('booking.update', booking.id, undefined, Ziggy), {
            status: newStatus,
        }, {
            preserveScroll: true,
        });
    }, []);

    const tableColumns = useMemo(() => columns(setEditingBooking, setDeletingBooking, handleStatusChange), [handleStatusChange]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookings" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
                        <p className="text-muted-foreground">
                            Manage vehicle service bookings and status.
                        </p>
                    </div>
                </div>

                {bookings.length > 0 ? (
                    <DataTable 
                        columns={tableColumns} 
                        data={bookings} 
                        searchKey="user.name" 
                        searchPlaceholder="Filter customer..."
                        getRowId={(row) => String(row.id)}
                    />
                ) : (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Calendar className="h-12 w-12 text-muted-foreground" />
                            </EmptyMedia>
                            <EmptyTitle>No bookings found</EmptyTitle>
                            <EmptyDescription>
                                No scheduled vehicle services at the moment.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button disabled>Create Booking</Button>
                        </EmptyContent>
                    </Empty>
                )}

                {/* Edit Modal */}
                <Dialog open={!!editingBooking} onOpenChange={(open) => !open && setEditingBooking(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Booking</DialogTitle>
                            <DialogDescription>
                                Update booking information.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitEdit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-date">Date</Label>
                                    <Input
                                        id="edit-date"
                                        type="date"
                                        value={editData.date}
                                        onChange={(e) => setEditData('date', e.target.value)}
                                        required
                                    />
                                    {editErrors.date && <p className="text-sm text-destructive">{editErrors.date}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-complaint">Complaint</Label>
                                    <Textarea
                                        id="edit-complaint"
                                        value={editData.complaint}
                                        onChange={(e) => setEditData('complaint', e.target.value)}
                                        required
                                    />
                                    {editErrors.complaint && <p className="text-sm text-destructive">{editErrors.complaint}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select value={editData.status} onValueChange={(value) => setEditData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {editErrors.status && <p className="text-sm text-destructive">{editErrors.status}</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={editProcessing}>Update Booking</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <AlertDialog open={!!deletingBooking} onOpenChange={(open) => !open && setDeletingBooking(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the booking
                                <strong> {deletingBooking?.complaint}</strong> and remove it from the system.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
