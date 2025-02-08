import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Product, ProductInput, CATEGORIES, productApi } from "../../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProductModalProps {
	product?: Product;
	onClose: () => void;
	onSave: () => void;
}

export function ProductModal({ product, onClose, onSave }: ProductModalProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ProductInput>({
		defaultValues: product
			? {
					name: product.name,
					description: product.description,
					price: product.price,
					category: product.category,
					quantity: product.quantity,
			  }
			: undefined,
	});

	const onSubmit = async (data: ProductInput) => {
		try {
			if (product) {
				await productApi.updateProduct(product._id, data);
			} else {
				await productApi.createProduct(data);
			}
			onSave();
		} catch (error) {
			console.error("Error saving product:", error);
		}
	};

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
					<Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
						<X className="h-4 w-4" />
					</Button>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<label className="text-sm font-medium">Name</label>
						<Input type="text" {...register("name", { required: "Name is required" })} />
						{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Price</label>
						<Input
							type="number"
							step="0.01"
							{...register("price", {
								required: "Price is required",
								min: { value: 0, message: "Price must be positive" },
							})}
						/>
						{errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Category</label>
						<select
							{...register("category", { required: "Category is required" })}
							className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
						>
							<option value="">Select a category</option>
							{CATEGORIES.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
						{errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Quantity</label>
						<Input
							type="number"
							{...register("quantity", {
								required: "Quantity is required",
								min: { value: 0, message: "Quantity must be positive" },
							})}
						/>
						{errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Description</label>
						<textarea
							{...register("description", { required: "Description is required" })}
							rows={3}
							className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
						/>
						{errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
					</div>

					<div className="flex justify-end space-x-2">
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Saving..." : "Save"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
