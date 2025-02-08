import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Product, productApi, CATEGORIES, PRICE_RANGES } from "../../services/api";
import { ProductModal } from "./ProductModal";
import { DeleteProductModal } from "./DeleteProductModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductList() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedPriceRange, setSelectedPriceRange] = useState("");
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const filters: Record<string, any> = {};

			if (selectedCategory) {
				filters.category = selectedCategory;
			}

			if (selectedPriceRange) {
				const range = PRICE_RANGES.find((r) => r.label === selectedPriceRange);
				if (range) {
					filters.minPrice = range.min;
					if (range.max) filters.maxPrice = range.max;
				}
			}

			const data = searchQuery
				? await productApi.searchProducts(searchQuery)
				: await productApi.getProducts(page, 10, filters);

			setProducts(data.products || []);
			setTotalPages(data.pagination?.pages || 1);

			// If we're on a page higher than the total pages, go back to page 1
			if (page > (data.pagination?.pages || 1)) {
				setPage(1);
			}
		} catch (error) {
			console.error("Error fetching products:", error);
			setProducts([]);
			setTotalPages(1);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchProducts();
	}, [page, searchQuery, selectedCategory, selectedPriceRange]);

	const handleEdit = (product: Product) => {
		setEditingProduct(product);
	};

	const handleUpdate = async () => {
		await fetchProducts();
		setEditingProduct(null);
	};

	const handleDelete = (product: Product) => {
		setDeletingProduct(product);
	};

	const handleDeleteConfirm = async () => {
		await fetchProducts();
		setDeletingProduct(null);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Products</CardTitle>
			</CardHeader>
			<CardContent>
				{/* Filters */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
					<Input
						type="text"
						placeholder="Search products..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>

					<select
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
						className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
					>
						<option value="">All Categories</option>
						{CATEGORIES.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>

					<select
						value={selectedPriceRange}
						onChange={(e) => setSelectedPriceRange(e.target.value)}
						className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
					>
						<option value="">All Prices</option>
						{PRICE_RANGES.map((range) => (
							<option key={range.label} value={range.label}>
								{range.label}
							</option>
						))}
					</select>
				</div>

				{/* Table */}
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Price</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Quantity</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center">
										Loading...
									</TableCell>
								</TableRow>
							) : products.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center">
										No products found
									</TableCell>
								</TableRow>
							) : (
								products.map((product) => (
									<TableRow key={product._id}>
										<TableCell>{product.name}</TableCell>
										<TableCell>${product.price.toFixed(2)}</TableCell>
										<TableCell>{product.category}</TableCell>
										<TableCell>{product.quantity}</TableCell>
										<TableCell>
											<div className="flex space-x-2">
												<Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="text-destructive"
													onClick={() => handleDelete(product)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				{/* Pagination */}
				<div className="mt-4 flex items-center justify-between">
					<Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
						Previous
					</Button>
					<span className="text-sm text-muted-foreground">
						Page {page} of {totalPages}
					</span>
					<Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>
						Next
					</Button>
				</div>
			</CardContent>

			{/* Edit Modal */}
			{editingProduct && (
				<ProductModal
					product={editingProduct}
					onClose={() => setEditingProduct(null)}
					onSave={handleUpdate}
				/>
			)}

			{/* Delete Modal */}
			{deletingProduct && (
				<DeleteProductModal
					product={deletingProduct}
					onClose={() => setDeletingProduct(null)}
					onDelete={handleDeleteConfirm}
				/>
			)}
		</Card>
	);
}
