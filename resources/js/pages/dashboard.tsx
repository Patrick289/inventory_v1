import { Head } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from '@inertiajs/react';
import { dashboard } from '@/routes';

export default function Dashboard() {
    const form = useForm({
        name: '',
        price: '',
        description: '',
        category_id: '',
        quantity: '',
        supplier: '',
    });

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post('/products', {
            onSuccess: () => {
                form.reset();
            },
        });
    }

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-xl font-semibold">Products</h1>
                    <p className="text-sm text-muted-foreground">
                        Welcome to your Products
                    </p>
                </div>

                <form
                    className="max-w-xs space-y-4 rounded-lg border p-4"
                    onSubmit={submit}
                >
                    <div className="space-y-2">
                        <Label htmlFor="name">Name:</Label>
                        <Input
                            type="text"
                            id="name"
                            value={form.data.name}
                            onChange={(event) =>
                                form.setData('name', event.target.value)
                            }
                        />
                        {form.errors.name && (
                            <p className="text-red-600">{form.errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Price:</Label>
                        <Input
                            type="number"
                            id="price"
                            value={form.data.price}
                            onChange={(event) =>
                                form.setData('price', event.target.value)
                            }
                        />
                        {form.errors.price && (
                            <p className="text-red-600">{form.errors.price}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description:</Label>
                        <Input
                            type="text"
                            id="description"
                            value={form.data.description}
                            onChange={(event) =>
                                form.setData('description', event.target.value)
                            }
                        />
                        {form.errors.description && (
                            <p className="text-red-600">{form.errors.description}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category_id">Category ID:</Label>
                        <Input
                            type="number"
                            id="category_id"
                            value={form.data.category_id}
                            onChange={(event) =>
                                form.setData('category_id', event.target.value)
                            }
                        />
                        {form.errors.category_id && (
                            <p className="text-red-600">{form.errors.category_id}</p>
                        )}

                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity:</Label>
                        <Input
                            type="number"
                            id="quantity"
                            value={form.data.quantity}
                            onChange={(event) =>
                                form.setData('quantity', event.target.value)
                            }
                        />
                        {form.errors.quantity && (
                            <p className="text-red-600">{form.errors.quantity}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="supplier">Supplier:</Label>
                        <Input
                            type="text"
                            id="supplier"
                            value={form.data.supplier}
                            onChange={(event) =>
                                form.setData('supplier', event.target.value)
                            }
                        />
                        {form.errors.supplier && (
                            <p className="text-red-600">{form.errors.supplier}</p>
                        )}
                    </div>

                    <Button type="submit">Save Product</Button>
                </form>

                {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>

                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div> */}
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