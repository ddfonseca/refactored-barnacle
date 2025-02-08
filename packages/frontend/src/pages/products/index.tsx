import { ProductList } from "@/components/products/ProductList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductsPage() {
	return (
		<div className="container py-10">
			<ProductList />
		</div>
	);
}
