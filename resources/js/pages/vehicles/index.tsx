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
import { Vehicle } from '@/types';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Customer } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Car, Plus } from 'lucide-react';
import { FormEventHandler, useState, useEffect, useCallback, useMemo } from 'react';
import { route } from 'ziggy-js';
import { Ziggy } from '@/ziggy';

const breadcrumbs = [
    {
        title: 'Vehicles',
        href: route('vehicle.index', undefined, undefined, Ziggy),
    },
];

interface IndexProps {
    vehicles: Vehicle[];
    customers: Customer[];
}

export default function Index({ vehicles, customers }: IndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);

    // Combobox states
    const [openCreateCombobox, setOpenCreateCombobox] = useState(false);
    const [openEditCombobox, setOpenEditCombobox] = useState(false);

    // Create Form
    const { data: createData, setData: setCreateData, post: createPost, processing: createProcessing, errors: createErrors, reset: createReset } = useForm({
        customer_id: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        plate_no: '',
    });

    const submitCreate: FormEventHandler = (e) => {
        e.preventDefault();
        createPost(route('vehicle.store', undefined, undefined, Ziggy), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                createReset();
            },
        });
    };

    // Edit Form
    const { data: editData, setData: setEditData, put: editPut, processing: editProcessing, errors: editErrors, reset: editReset, clearErrors: clearEditErrors } = useForm({
        customer_id: '',
        brand: '',
        model: '',
        year: 0,
        plate_no: '',
    });

    const editClearErrors = useCallback(() => {
        clearEditErrors();
    }, [clearEditErrors]);

    useEffect(() => {
        if (editingVehicle) {
            setEditData({
                customer_id: String(editingVehicle.customer_id),
                brand: editingVehicle.brand,
                model: editingVehicle.model,
                year: editingVehicle.year,
                plate_no: editingVehicle.plate_no,
            });
            editClearErrors();
        }
    }, [editingVehicle, editClearErrors, setEditData]);

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingVehicle) {
            editPut(route('vehicle.update', editingVehicle.id, undefined, Ziggy), {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingVehicle(null);
                    editReset();
                },
            });
        }
    };

    // Delete Action
    const { delete: destroy } = useForm();

    const confirmDelete = () => {
        if (deletingVehicle) {
            destroy(route('vehicle.destroy', deletingVehicle.id, undefined, Ziggy), {
                preserveScroll: true,
                onSuccess: () => setDeletingVehicle(null),
            });
        }
    };


    const tableColumns = useMemo(() => columns(setEditingVehicle, setDeletingVehicle), []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehicles" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
                        <p className="text-muted-foreground">
                            Manage your vehicles and their owners.
                        </p>
                    </div>
                    
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Vehicle
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create Vehicle</DialogTitle>
                                <DialogDescription>
                                    Add a new vehicle to your fleet.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={submitCreate}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-customer">Owner</Label>
                                        <Popover open={openCreateCombobox} onOpenChange={setOpenCreateCombobox} modal={true}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openCreateCombobox}
                                                    className="w-full justify-between"
                                                >
                                                    {createData.customer_id
                                                        ? customers.find((customer) => String(customer.id) === createData.customer_id)?.name
                                                        : "Select customer..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search customer..." />
                                                    <CommandList className="max-h-[200px] overflow-y-auto">
                                                        <CommandEmpty>No customer found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {customers.map((customer) => (
                                                                <CommandItem
                                                                    key={customer.id}
                                                                    value={customer.name}
                                                                    onSelect={() => {
                                                                        setCreateData('customer_id', String(customer.id));
                                                                        setOpenCreateCombobox(false);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            createData.customer_id === String(customer.id) ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {customer.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        {createErrors.customer_id && <p className="text-sm text-destructive">{createErrors.customer_id}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="create-brand">Brand</Label>
                                            <Input
                                                id="create-brand"
                                                value={createData.brand}
                                                onChange={(e) => setCreateData('brand', e.target.value)}
                                                required
                                            />
                                            {createErrors.brand && <p className="text-sm text-destructive">{createErrors.brand}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="create-model">Model</Label>
                                            <Input
                                                id="create-model"
                                                value={createData.model}
                                                onChange={(e) => setCreateData('model', e.target.value)}
                                                required
                                            />
                                            {createErrors.model && <p className="text-sm text-destructive">{createErrors.model}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="create-plate">Plate No</Label>
                                            <Input
                                                id="create-plate"
                                                value={createData.plate_no}
                                                onChange={(e) => setCreateData('plate_no', e.target.value)}
                                                required
                                            />
                                            {createErrors.plate_no && <p className="text-sm text-destructive">{createErrors.plate_no}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="create-year">Year</Label>
                                            <Input
                                                id="create-year"
                                                type="number"
                                                value={createData.year}
                                                onChange={(e) => setCreateData('year', parseInt(e.target.value))}
                                                required
                                            />
                                            {createErrors.year && <p className="text-sm text-destructive">{createErrors.year}</p>}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={createProcessing}>Save Vehicle</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {vehicles.length > 0 ? (
                    <DataTable 
                        columns={tableColumns} 
                        data={vehicles} 
                        searchKey="plate_no" 
                        searchPlaceholder="Filter plate number..."
                        getRowId={(row) => String(row.id)}
                    />
                ) : (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Car className="h-12 w-12 text-muted-foreground" />
                            </EmptyMedia>
                            <EmptyTitle>No vehicles found</EmptyTitle>
                            <EmptyDescription>
                                Get started by adding a new vehicle.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button onClick={() => setIsCreateOpen(true)}>Add Vehicle</Button>
                        </EmptyContent>
                    </Empty>
                )}

                {/* Edit Modal */}
                <Dialog open={!!editingVehicle} onOpenChange={(open) => !open && setEditingVehicle(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Vehicle</DialogTitle>
                            <DialogDescription>
                                Update vehicle information.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitEdit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-customer">Owner</Label>
                                    <Popover open={openEditCombobox} onOpenChange={setOpenEditCombobox} modal={true}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openEditCombobox}
                                                className="w-full justify-between"
                                            >
                                                {editData.customer_id
                                                    ? customers.find((customer) => String(customer.id) === editData.customer_id)?.name
                                                    : "Select customer..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search customer..." />
                                                <CommandList className="max-h-[200px] overflow-y-auto">
                                                    <CommandEmpty>No customer found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {customers.map((customer) => (
                                                            <CommandItem
                                                                key={customer.id}
                                                                value={customer.name}
                                                                onSelect={() => {
                                                                    setEditData('customer_id', String(customer.id));
                                                                    setOpenEditCombobox(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        editData.customer_id === String(customer.id) ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {customer.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {editErrors.customer_id && <p className="text-sm text-destructive">{editErrors.customer_id}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-brand">Brand</Label>
                                        <Input
                                            id="edit-brand"
                                            value={editData.brand}
                                            onChange={(e) => setEditData('brand', e.target.value)}
                                            required
                                        />
                                        {editErrors.brand && <p className="text-sm text-destructive">{editErrors.brand}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-model">Model</Label>
                                        <Input
                                            id="edit-model"
                                            value={editData.model}
                                            onChange={(e) => setEditData('model', e.target.value)}
                                            required
                                        />
                                        {editErrors.model && <p className="text-sm text-destructive">{editErrors.model}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-plate">Plate No</Label>
                                        <Input
                                            id="edit-plate"
                                            value={editData.plate_no}
                                            onChange={(e) => setEditData('plate_no', e.target.value)}
                                            required
                                        />
                                        {editErrors.plate_no && <p className="text-sm text-destructive">{editErrors.plate_no}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-year">Year</Label>
                                        <Input
                                            id="edit-year"
                                            type="number"
                                            value={editData.year}
                                            onChange={(e) => setEditData('year', parseInt(e.target.value))}
                                            required
                                        />
                                        {editErrors.year && <p className="text-sm text-destructive">{editErrors.year}</p>}
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
                <AlertDialog open={!!deletingVehicle} onOpenChange={(open) => !open && setDeletingVehicle(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the vehicle
                                <strong> {deletingVehicle?.plate_no}</strong> and remove it from the system.
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
