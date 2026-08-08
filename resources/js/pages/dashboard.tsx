import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { firestore } from '@/lib/firebase';
import { dashboard } from '@/routes';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';
import { PackagePlus, Pencil, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type InventoryForm = {
    name: string;
    price: string;
    description: string;
    categoryId: string;
    quantity: string;
    supplier: string;
};

type InventoryItem = InventoryForm & {
    id: string;
};

const emptyInventoryForm: InventoryForm = {
    name: '',
    price: '',
    description: '',
    categoryId: '',
    quantity: '',
    supplier: '',
};

export default function Dashboard() {
    const [inventoryForm, setInventoryForm] =
        useState<InventoryForm>(emptyInventoryForm);
    const [inventoryErrors, setInventoryErrors] = useState<
        Partial<Record<keyof InventoryForm, string>>
    >({});
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [editingInventoryId, setEditingInventoryId] = useState<string | null>(
        null,
    );
    const [isSavingInventory, setIsSavingInventory] = useState(false);
    const [deletingInventoryId, setDeletingInventoryId] = useState<
        string | null
    >(null);

    useEffect(() => {
        const inventoryQuery = query(
            collection(firestore, 'inventories'),
            orderBy('createdAt', 'desc'),
        );

        const unsubscribe = onSnapshot(
            inventoryQuery,
            (snapshot) => {
                setInventoryItems(
                    snapshot.docs.map((inventoryDoc) => {
                        const data = inventoryDoc.data();

                        return {
                            id: inventoryDoc.id,
                            name: String(data.name ?? ''),
                            price: String(data.price ?? ''),
                            description: String(data.description ?? ''),
                            categoryId: String(data.categoryId ?? ''),
                            quantity: String(data.quantity ?? ''),
                            supplier: String(data.supplier ?? ''),
                        };
                    }),
                );
            },
            (error) => {
                console.error(error);
                toast.error('Unable to load inventory from Firestore.');
            },
        );

        return unsubscribe;
    }, []);

    function updateInventoryField(field: keyof InventoryForm, value: string) {
        setInventoryForm((current) => ({
            ...current,
            [field]: value,
        }));
        setInventoryErrors((current) => ({
            ...current,
            [field]: undefined,
        }));
    }

    function validateInventoryForm() {
        const errors: Partial<Record<keyof InventoryForm, string>> = {};

        if (!inventoryForm.name.trim()) {
            errors.name = 'Name is required.';
        }

        if (!inventoryForm.price) {
            errors.price = 'Price is required.';
        }

        if (!inventoryForm.categoryId) {
            errors.categoryId = 'Category ID is required.';
        }

        if (!inventoryForm.quantity) {
            errors.quantity = 'Quantity is required.';
        }

        if (!inventoryForm.supplier.trim()) {
            errors.supplier = 'Supplier is required.';
        }

        setInventoryErrors(errors);

        return Object.keys(errors).length === 0;
    }

    async function submitInventory(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validateInventoryForm()) {
            return;
        }

        setIsSavingInventory(true);

        try {
            const inventoryData = {
                name: inventoryForm.name.trim(),
                price: Number(inventoryForm.price),
                description: inventoryForm.description.trim(),
                categoryId: Number(inventoryForm.categoryId),
                quantity: Number(inventoryForm.quantity),
                supplier: inventoryForm.supplier.trim(),
            };

            if (editingInventoryId) {
                await updateDoc(
                    doc(firestore, 'inventories', editingInventoryId),
                    {
                        ...inventoryData,
                        updatedAt: serverTimestamp(),
                    },
                );

                setEditingInventoryId(null);
                toast.success('Inventory item updated in Firebase Firestore.');
            } else {
                await addDoc(collection(firestore, 'inventories'), {
                    ...inventoryData,
                    createdAt: serverTimestamp(),
                });

                toast.success('Inventory item saved to Firebase Firestore.');
            }

            setInventoryForm(emptyInventoryForm);
        } catch (error) {
            console.error(error);
            toast.error('Unable to save inventory item in Firestore.');
        } finally {
            setIsSavingInventory(false);
        }
    }

    function editInventoryItem(item: InventoryItem) {
        setEditingInventoryId(item.id);
        setInventoryForm({
            name: item.name,
            price: item.price,
            description: item.description,
            categoryId: item.categoryId,
            quantity: item.quantity,
            supplier: item.supplier,
        });
        setInventoryErrors({});
    }

    function cancelInventoryEdit() {
        setEditingInventoryId(null);
        setInventoryForm(emptyInventoryForm);
        setInventoryErrors({});
    }

    async function deleteInventoryItem(itemId: string) {
        setDeletingInventoryId(itemId);

        try {
            await deleteDoc(doc(firestore, 'inventories', itemId));

            if (editingInventoryId === itemId) {
                cancelInventoryEdit();
            }

            toast.success('Inventory item deleted from Firebase Firestore.');
        } catch (error) {
            console.error(error);
            toast.error('Unable to delete inventory item from Firestore.');
        } finally {
            setDeletingInventoryId(null);
        }
    }

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-xl font-semibold">Inventory</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage inventory records stored in Firebase Firestore.
                    </p>
                </div>

                <form
                    className="grid w-full max-w-2xl gap-4 rounded-lg border p-4 md:grid-cols-2"
                    onSubmit={submitInventory}
                >
                    <div className="md:col-span-2">
                        <h2 className="text-lg font-semibold">
                            {editingInventoryId
                                ? 'Edit Inventory'
                                : 'New Inventory'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Inventory entries are saved directly to Firebase
                            Firestore.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="inventory-name">Name</Label>
                        <Input
                            id="inventory-name"
                            type="text"
                            value={inventoryForm.name}
                            onChange={(event) =>
                                updateInventoryField('name', event.target.value)
                            }
                        />
                        {inventoryErrors.name && (
                            <p className="text-sm text-red-600">
                                {inventoryErrors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="inventory-price">Price</Label>
                        <Input
                            id="inventory-price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={inventoryForm.price}
                            onChange={(event) =>
                                updateInventoryField(
                                    'price',
                                    event.target.value,
                                )
                            }
                        />
                        {inventoryErrors.price && (
                            <p className="text-sm text-red-600">
                                {inventoryErrors.price}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="inventory-description">
                            Description
                        </Label>
                        <Input
                            id="inventory-description"
                            type="text"
                            value={inventoryForm.description}
                            onChange={(event) =>
                                updateInventoryField(
                                    'description',
                                    event.target.value,
                                )
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="inventory-category-id">
                            Category ID
                        </Label>
                        <Input
                            id="inventory-category-id"
                            type="number"
                            min="0"
                            value={inventoryForm.categoryId}
                            onChange={(event) =>
                                updateInventoryField(
                                    'categoryId',
                                    event.target.value,
                                )
                            }
                        />
                        {inventoryErrors.categoryId && (
                            <p className="text-sm text-red-600">
                                {inventoryErrors.categoryId}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="inventory-quantity">Quantity</Label>
                        <Input
                            id="inventory-quantity"
                            type="number"
                            min="0"
                            value={inventoryForm.quantity}
                            onChange={(event) =>
                                updateInventoryField(
                                    'quantity',
                                    event.target.value,
                                )
                            }
                        />
                        {inventoryErrors.quantity && (
                            <p className="text-sm text-red-600">
                                {inventoryErrors.quantity}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="inventory-supplier">Supplier</Label>
                        <Input
                            id="inventory-supplier"
                            type="text"
                            value={inventoryForm.supplier}
                            onChange={(event) =>
                                updateInventoryField(
                                    'supplier',
                                    event.target.value,
                                )
                            }
                        />
                        {inventoryErrors.supplier && (
                            <p className="text-sm text-red-600">
                                {inventoryErrors.supplier}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <Button type="submit" disabled={isSavingInventory}>
                            <PackagePlus />
                            {isSavingInventory
                                ? 'Saving...'
                                : editingInventoryId
                                  ? 'Update Inventory'
                                  : 'Save Inventory'}
                        </Button>
                        {editingInventoryId && (
                            <Button
                                className="ml-2"
                                type="button"
                                variant="outline"
                                onClick={cancelInventoryEdit}
                                disabled={isSavingInventory}
                            >
                                <X />
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>

                <div className="w-full max-w-2xl space-y-3 rounded-lg border p-4">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Inventory Items
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Edit or delete records stored in Firebase Firestore.
                        </p>
                    </div>

                    {inventoryItems.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No inventory items found.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {inventoryItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium">
                                            {item.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Price: {item.price} | Quantity:{' '}
                                            {item.quantity} | Category:{' '}
                                            {item.categoryId}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Supplier: {item.supplier}
                                        </p>
                                        {item.description && (
                                            <p className="mt-1 text-sm">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex shrink-0 gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                editInventoryItem(item)
                                            }
                                        >
                                            <Pencil />
                                            Edit
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            disabled={
                                                deletingInventoryId === item.id
                                            }
                                            onClick={() =>
                                                deleteInventoryItem(item.id)
                                            }
                                        >
                                            <Trash2 />
                                            {deletingInventoryId === item.id
                                                ? 'Deleting...'
                                                : 'Delete'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
