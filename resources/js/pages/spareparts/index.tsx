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
import { Sparepart } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Wrench, Plus } from 'lucide-react';
import { FormEventHandler, useState, useEffect, useCallback, useMemo } from 'react';

const breadcrumbs = [
    {
        title: 'Spareparts',
        href: route('sparepart.index', undefined, undefined, Ziggy),
    },
];

interface IndexProps {
    spareparts: Sparepart[];
}

export default function Index({ spareparts }: IndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingSparepart, setEditingSparepart] = useState<Sparepart | null>(null);
    const [deletingSparepart, setDeletingSparepart] = useState<Sparepart | null>(null);

    // Create Form
    const { data: createData, setData: setCreateData, post: createPost, processing: createProcessing, errors: createErrors, reset: createReset } = useForm({
        sku: '',
        name: '',
        price: '',
        stock: '',
        min_stock: '',
    });

    const submitCreate: FormEventHandler = (e) => {
        e.preventDefault();
        createPost(route('sparepart.store', undefined, undefined, Ziggy), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                createReset();
            },
        });
    };

    // Edit Form
    const { data: editData, setData: setEditData, put: editPut, processing: editProcessing, errors: editErrors, reset: editReset, clearErrors: clearEditErrors } = useForm({
        sku: '',
        name: '',
        price: '',
        stock: '',
        min_stock: '',
    });

    const editClearErrors = useCallback(() => {
        clearEditErrors();
    }, [clearEditErrors]);

    useEffect(() => {
        if (editingSparepart) {
            setEditData({
                sku: editingSparepart.sku,
                name: editingSparepart.name,
                price: String(editingSparepart.price),
                stock: String(editingSparepart.stock),
                min_stock: String(editingSparepart.min_stock),
            });
            editClearErrors();
        }
    }, [editingSparepart, editClearErrors, setEditData]);

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingSparepart) {
            editPut(route('sparepart.update', editingSparepart.id, undefined, Ziggy), {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingSparepart(null);
                    editReset();
                },
            });
        }
    };

    // Delete Action
    const { delete: destroy } = useForm();

    const confirmDelete = () => {
        if (deletingSparepart) {
            destroy(route('sparepart.destroy', deletingSparepart.id, undefined, Ziggy), {
                preserveScroll: true,
                onSuccess: () => setDeletingSparepart(null),
            });
        }
    };

    const tableColumns = useMemo(() => columns(setEditingSparepart, setDeletingSparepart), []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Spareparts" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Spareparts</h1>
                        <p className="text-muted-foreground">
                            Manage your inventory of spare parts.
                        </p>
                    </div>
                    
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Sparepart
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px]">
                            <DialogHeader>
                                <DialogTitle>Create Sparepart</DialogTitle>
                                <DialogDescription>
                                    Add a new sparepart to your inventory.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={submitCreate}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="create-sku">SKU</Label>
                                            <Input
                                                id="create-sku"
                                                value={createData.sku}
                                                onChange={(e) => setCreateData('sku', e.target.value)}
                                                required
                                            />
                                            {createErrors.sku && <p className="text-sm text-destructive">{createErrors.sku}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="create-price">Price (IDR)</Label>
                                            <Input
                                                id="create-price"
                                                type="number"
                                                value={createData.price}
                                                onChange={(e) => setCreateData('price', e.target.value)}
                                                required
                                            />
                                            {createErrors.price && <p className="text-sm text-destructive">{createErrors.price}</p>}
                                        </div>
                                    </div>
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
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="create-stock">Stock</Label>
                                            <Input
                                                id="create-stock"
                                                type="number"
                                                value={createData.stock}
                                                onChange={(e) => setCreateData('stock', e.target.value)}
                                                required
                                            />
                                            {createErrors.stock && <p className="text-sm text-destructive">{createErrors.stock}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="create-min-stock">Min Stock</Label>
                                            <Input
                                                id="create-min-stock"
                                                type="number"
                                                value={createData.min_stock}
                                                onChange={(e) => setCreateData('min_stock', e.target.value)}
                                                required
                                            />
                                            {createErrors.min_stock && <p className="text-sm text-destructive">{createErrors.min_stock}</p>}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={createProcessing}>Save Sparepart</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {spareparts.length > 0 ? (
                    <DataTable 
                        columns={tableColumns} 
                        data={spareparts} 
                        searchKey="name" 
                        getRowId={(row) => String(row.id)}
                    />
                ) : (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Wrench className="h-12 w-12 text-muted-foreground" />
                            </EmptyMedia>
                            <EmptyTitle>No spareparts found</EmptyTitle>
                            <EmptyDescription>
                                Get started by adding a new sparepart.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button onClick={() => setIsCreateOpen(true)}>Add Sparepart</Button>
                        </EmptyContent>
                    </Empty>
                )}

                {/* Edit Modal */}
                <Dialog open={!!editingSparepart} onOpenChange={(open) => !open && setEditingSparepart(null)}>
                    <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                            <DialogTitle>Edit Sparepart</DialogTitle>
                            <DialogDescription>
                                Update sparepart information.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitEdit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-sku">SKU</Label>
                                        <Input
                                            id="edit-sku"
                                            value={editData.sku}
                                            onChange={(e) => setEditData('sku', e.target.value)}
                                            required
                                        />
                                        {editErrors.sku && <p className="text-sm text-destructive">{editErrors.sku}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-price">Price (IDR)</Label>
                                        <Input
                                            id="edit-price"
                                            type="number"
                                            value={editData.price}
                                            onChange={(e) => setEditData('price', e.target.value)}
                                            required
                                        />
                                        {editErrors.price && <p className="text-sm text-destructive">{editErrors.price}</p>}
                                    </div>
                                </div>
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-stock">Stock</Label>
                                        <Input
                                            id="edit-stock"
                                            type="number"
                                            value={editData.stock}
                                            onChange={(e) => setEditData('stock', e.target.value)}
                                            required
                                        />
                                        {editErrors.stock && <p className="text-sm text-destructive">{editErrors.stock}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-min-stock">Min Stock</Label>
                                        <Input
                                            id="edit-min-stock"
                                            type="number"
                                            value={editData.min_stock}
                                            onChange={(e) => setEditData('min_stock', e.target.value)}
                                            required
                                        />
                                        {editErrors.min_stock && <p className="text-sm text-destructive">{editErrors.min_stock}</p>}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={editProcessing}>Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <AlertDialog open={!!deletingSparepart} onOpenChange={(open) => !open && setDeletingSparepart(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete sparepart
                                <strong> {deletingSparepart?.name}</strong> and remove it from the system.
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
