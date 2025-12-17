import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Customer } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Users } from 'lucide-react';
import { FormEventHandler, useState, useEffect, useCallback, useMemo } from 'react';
import { route } from 'ziggy-js';
import { Ziggy } from '@/ziggy';

const breadcrumbs = [
    {
        title: 'Customers',
        href: route('customer.index', undefined, undefined, Ziggy),
    },
];

interface IndexProps {
    customers: Customer[];
}

export default function Index({ customers }: IndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

    // Create Form
    const { data: createData, setData: setCreateData, post: createPost, processing: createProcessing, errors: createErrors, reset: createReset } = useForm({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
    });

    const submitCreate: FormEventHandler = (e) => {
        e.preventDefault();
        createPost(route('customer.store', undefined, undefined, Ziggy), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                createReset();
            },
        });
    };

    // Edit Form
    const { data: editData, setData: setEditData, put: editPut, processing: editProcessing, errors: editErrors, reset: editReset, clearErrors: clearEditErrors } = useForm({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
    });

    const editClearErrors = useCallback(() => {
        clearEditErrors();
    }, [clearEditErrors]);

    useEffect(() => {
        if (editingCustomer) {
            setEditData({
                name: editingCustomer.name,
                phone: editingCustomer.phone,
                email: editingCustomer.email,
                address: editingCustomer.address,
                notes: editingCustomer.notes || '',
            });
            editClearErrors();
        }
    }, [editingCustomer, setEditData, editClearErrors]);

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingCustomer) {
            editPut(route('customer.update', editingCustomer.id, undefined, Ziggy), {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingCustomer(null);
                    editReset();
                },
            });
        }
    };

    // Delete Action
    const { delete: destroy } = useForm();

    const confirmDelete = () => {
        if (deletingCustomer) {
            destroy(route('customer.destroy', deletingCustomer.id, undefined, Ziggy), {
                preserveScroll: true,
                onSuccess: () => setDeletingCustomer(null),
            });
        }
    };


    const tableColumns = useMemo(() => columns(setEditingCustomer, setDeletingCustomer), []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
                        <p className="text-muted-foreground">
                            Manage your customers and their information.
                        </p>
                    </div>
                    
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Customer
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create Customer</DialogTitle>
                                <DialogDescription>
                                    Add a new customer to your database.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={submitCreate}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-name">Name</Label>
                                        <Input
                                            id="create-name"
                                            value={createData.name}
                                            onChange={(e) => setCreateData('name', e.target.value)}
                                            required
                                        />
                                        {createErrors.name && <p className="text-sm text-destructive">{createErrors.name}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-phone">Phone</Label>
                                        <Input
                                            id="create-phone"
                                            value={createData.phone}
                                            onChange={(e) => setCreateData('phone', e.target.value)}
                                            required
                                        />
                                        {createErrors.phone && <p className="text-sm text-destructive">{createErrors.phone}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-email">Email</Label>
                                        <Input
                                            id="create-email"
                                            type="email"
                                            value={createData.email}
                                            onChange={(e) => setCreateData('email', e.target.value)}
                                            required
                                        />
                                        {createErrors.email && <p className="text-sm text-destructive">{createErrors.email}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-address">Address</Label>
                                        <Textarea
                                            id="create-address"
                                            value={createData.address}
                                            onChange={(e) => setCreateData('address', e.target.value)}
                                            required
                                        />
                                        {createErrors.address && <p className="text-sm text-destructive">{createErrors.address}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-notes">Notes</Label>
                                        <Textarea
                                            id="create-notes"
                                            value={createData.notes}
                                            onChange={(e) => setCreateData('notes', e.target.value)}
                                        />
                                        {createErrors.notes && <p className="text-sm text-destructive">{createErrors.notes}</p>}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={createProcessing}>Save Customer</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {customers.length > 0 ? (
                    <DataTable 
                        columns={tableColumns} 
                        data={customers} 
                        searchKey="name" 
                        searchPlaceholder="Filter name..."
                        getRowId={(row) => String(row.id)}
                    />
                ) : (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Users className="h-12 w-12 text-muted-foreground" />
                            </EmptyMedia>
                            <EmptyTitle>No customers found</EmptyTitle>
                            <EmptyDescription>
                                Get started by creating a new customer.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button onClick={() => setIsCreateOpen(true)}>Add Customer</Button>
                        </EmptyContent>
                    </Empty>
                )}

                {/* Edit Modal */}
                <Dialog open={!!editingCustomer} onOpenChange={(open) => !open && setEditingCustomer(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Customer</DialogTitle>
                            <DialogDescription>
                                Update customer information.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitEdit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={editData.name}
                                        onChange={(e) => setEditData('name', e.target.value)}
                                        required
                                    />
                                    {editErrors.name && <p className="text-sm text-destructive">{editErrors.name}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-phone">Phone</Label>
                                    <Input
                                        id="edit-phone"
                                        value={editData.phone}
                                        onChange={(e) => setEditData('phone', e.target.value)}
                                        required
                                    />
                                    {editErrors.phone && <p className="text-sm text-destructive">{editErrors.phone}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) => setEditData('email', e.target.value)}
                                        required
                                    />
                                    {editErrors.email && <p className="text-sm text-destructive">{editErrors.email}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-address">Address</Label>
                                    <Textarea
                                        id="edit-address"
                                        value={editData.address}
                                        onChange={(e) => setEditData('address', e.target.value)}
                                        required
                                    />
                                    {editErrors.address && <p className="text-sm text-destructive">{editErrors.address}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-notes">Notes</Label>
                                    <Textarea
                                        id="edit-notes"
                                        value={editData.notes}
                                        onChange={(e) => setEditData('notes', e.target.value)}
                                    />
                                    {editErrors.notes && <p className="text-sm text-destructive">{editErrors.notes}</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={editProcessing}>Update Customer</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <AlertDialog open={!!deletingCustomer} onOpenChange={(open) => !open && setDeletingCustomer(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the customer
                                <strong> {deletingCustomer?.name}</strong> and remove their data from our servers.
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
