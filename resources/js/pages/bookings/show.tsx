import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
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
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Booking, BreadcrumbItem, Sparepart, SparepartUsage } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler, useState, useMemo } from 'react';
import { route } from 'ziggy-js';
import { Ziggy } from '@/ziggy';
import { format } from 'date-fns';

interface ShowProps {
    booking: Booking;
    spareparts: Sparepart[];
}

export default function Show({ booking, spareparts }: ShowProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [deletingUsage, setDeletingUsage] = useState<SparepartUsage | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Bookings',
            href: route('booking.index', undefined, undefined, Ziggy),
        },
        {
            title: `Booking #${booking.id}`,
            href: route('booking.show', booking.id, undefined, Ziggy),
        },
    ];

    // Add Sparepart Usage Form
    const { data: addData, setData: setAddData, post: addPost, processing: addProcessing, errors: addErrors, reset: addReset } = useForm({
        booking_id: booking.id,
        sparepart_id: '',
        qty: 1,
    });

    const submitAdd: FormEventHandler = (e) => {
        e.preventDefault();
        addPost(route('sparepart-usage.store', undefined, undefined, Ziggy), {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddOpen(false);
                addReset();
            },
        });
    };

    // Delete Action
    const { delete: destroy } = useForm();

    const confirmDelete = () => {
        if (deletingUsage) {
            destroy(route('sparepart-usage.destroy', deletingUsage.id, undefined, Ziggy), {
                preserveScroll: true,
                onSuccess: () => setDeletingUsage(null),
            });
        }
    };

    // Calculate selected sparepart price
    const selectedSparepart = useMemo(() => {
        if (!addData.sparepart_id) return null;
        return spareparts.find(sp => String(sp.id) === addData.sparepart_id);
    }, [addData.sparepart_id, spareparts]);

    // Prepare combobox options with stock info
    const sparepartOptions = useMemo(() => {
        return spareparts.map(sp => ({
            value: String(sp.id),
            label: `${sp.name} - Rp ${sp.price.toLocaleString()} (Stock: ${sp.stock})`,
        }));
    }, [spareparts]);

    // Get max qty based on selected sparepart stock
    const maxQty = useMemo(() => {
        if (!selectedSparepart) return 999;
        return selectedSparepart.stock;
    }, [selectedSparepart]);

    // Calculate total
    const totalUsageCost = useMemo(() => {
        if (!booking.sparepart_usages) return 0;
        return booking.sparepart_usages.reduce((sum, usage) => {
            return sum + (usage.price_at_use * usage.qty);
        }, 0);
    }, [booking.sparepart_usages]);

    // Status badge
    const getStatusBadge = (status: string) => {
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
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Booking #${booking.id}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.visit(route('booking.index', undefined, undefined, Ziggy))}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Booking #{booking.id}</h1>
                            <p className="text-muted-foreground">
                                View and manage booking details
                            </p>
                        </div>
                    </div>
                    {getStatusBadge(booking.status)}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Booking Information */}
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-4 text-lg font-semibold">Booking Information</h2>
                        <dl className="space-y-2">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Date:</dt>
                                <dd className="font-medium">{format(new Date(booking.date), 'dd MMM yyyy')}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Customer:</dt>
                                <dd className="font-medium">{booking.user?.name}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Vehicle:</dt>
                                <dd className="font-medium">{booking.vehicle?.plate_no}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Model:</dt>
                                <dd className="font-medium">{booking.vehicle?.brand} {booking.vehicle?.model}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Complaint */}
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-4 text-lg font-semibold">Complaint</h2>
                        <p className="text-sm">{booking.complaint}</p>
                    </div>
                </div>

                {/* Sparepart Usages */}
                <div className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Sparepart Usage</h2>
                        <Button onClick={() => setIsAddOpen(true)} size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Sparepart
                        </Button>
                    </div>

                    {booking.sparepart_usages && booking.sparepart_usages.length > 0 ? (
                        <div className="space-y-2">
                            <div className="rounded-md border">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="p-2 text-left text-sm font-medium">Sparepart</th>
                                            <th className="p-2 text-right text-sm font-medium">Qty</th>
                                            <th className="p-2 text-right text-sm font-medium">Price</th>
                                            <th className="p-2 text-right text-sm font-medium">Subtotal</th>
                                            <th className="p-2 text-right text-sm font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {booking.sparepart_usages.map((usage) => (
                                            <tr key={usage.id} className="border-b last:border-0">
                                                <td className="p-2 text-sm">{usage.sparepart?.name}</td>
                                                <td className="p-2 text-right text-sm">{usage.qty}</td>
                                                <td className="p-2 text-right text-sm">Rp {usage.price_at_use.toLocaleString()}</td>
                                                <td className="p-2 text-right text-sm font-medium">
                                                    Rp {(usage.price_at_use * usage.qty).toLocaleString()}
                                                </td>
                                                <td className="p-2 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => setDeletingUsage(usage)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t bg-muted/50 font-semibold">
                                            <td colSpan={3} className="p-2 text-right text-sm">Total:</td>
                                            <td className="p-2 text-right text-sm">Rp {totalUsageCost.toLocaleString()}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-sm text-muted-foreground py-8">
                            No spareparts used yet. Click "Add Sparepart" to add one.
                        </p>
                    )}
                </div>

                {/* Add Sparepart Modal */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Sparepart Usage</DialogTitle>
                            <DialogDescription>
                                Select a sparepart and quantity to add to this booking.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitAdd}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="sparepart">Sparepart</Label>
                                    <Combobox
                                        options={sparepartOptions}
                                        value={addData.sparepart_id}
                                        onValueChange={(value) => setAddData('sparepart_id', value)}
                                        placeholder="Select sparepart..."
                                        searchPlaceholder="Search sparepart..."
                                        emptyText="No sparepart found."
                                    />
                                    {addErrors.sparepart_id && <p className="text-sm text-destructive">{addErrors.sparepart_id}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="qty">Quantity</Label>
                                    <Input
                                        id="qty"
                                        type="number"
                                        min="1"
                                        max={maxQty}
                                        value={addData.qty}
                                        onChange={(e) => setAddData('qty', Math.min(parseInt(e.target.value) || 1, maxQty))}
                                        required
                                    />
                                    {selectedSparepart && selectedSparepart.stock < addData.qty && (
                                        <p className="text-sm text-destructive">
                                            Insufficient stock. Available: {selectedSparepart.stock}
                                        </p>
                                    )}
                                    {addErrors.qty && <p className="text-sm text-destructive">{addErrors.qty}</p>}
                                </div>
                                {selectedSparepart && (
                                    <div className="space-y-2">
                                        <div className="rounded-md bg-muted p-3">
                                            <div className="flex justify-between text-sm">
                                                <span>Price per unit:</span>
                                                <span className="font-medium">Rp {selectedSparepart.price.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Available stock:</span>
                                                <span className={`font-medium ${selectedSparepart.stock < selectedSparepart.min_stock ? 'text-destructive' : ''}`}>
                                                    {selectedSparepart.stock} units
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm font-semibold mt-1 pt-1 border-t">
                                                <span>Subtotal:</span>
                                                <span>Rp {(selectedSparepart.price * addData.qty).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button 
                                    type="submit" 
                                    disabled={addProcessing || !addData.sparepart_id || (!!selectedSparepart && addData.qty > selectedSparepart.stock)}
                                >
                                    Add Sparepart
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <AlertDialog open={!!deletingUsage} onOpenChange={(open) => !open && setDeletingUsage(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will remove <strong>{deletingUsage?.sparepart?.name}</strong> from this booking.
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
