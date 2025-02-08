import { Link, Outlet } from "react-router-dom";

export function RootLayout() {
	return (
		<div className="min-h-screen bg-background">
			{/* Navigation */}
			<header className="border-b">
				<div className="container flex h-16 items-center px-4">
					<nav className="flex items-center space-x-6 text-sm font-medium">
						<Link
							to="/"
							className="transition-colors hover:text-foreground/80 text-foreground/60"
						>
							Home
						</Link>
						<Link
							to="/products"
							className="transition-colors hover:text-foreground/80 text-foreground/60"
						>
							Products
						</Link>
					</nav>
				</div>
			</header>

			{/* Main Content */}
			<main>
				<Outlet />
			</main>
		</div>
	);
}
