import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export function HomePage() {
	return (
		<div className="container py-10">
			<Card>
				<CardHeader>
					<CardTitle>Welcome to Inventory Management</CardTitle>
					<CardDescription>
						Manage your products efficiently with our modern inventory management system.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button asChild>
						<Link to="/products">Go to Products</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
