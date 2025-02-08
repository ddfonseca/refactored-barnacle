import { Product, productApi } from "../../services/api";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface DeleteProductModalProps {
	product: Product;
	onClose: () => void;
	onDelete: () => void;
}

export function DeleteProductModal({ product, onClose, onDelete }: DeleteProductModalProps) {
	const handleDelete = async () => {
		try {
			await productApi.deleteProduct(product._id);
			onDelete();
		} catch (error) {
			console.error("Error deleting product:", error);
		}
	};

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Product</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete &quot;{product.name}&quot;? This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<div className="flex justify-end space-x-2">
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="button" variant="destructive" onClick={handleDelete}>
							Delete
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
