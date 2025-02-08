import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function RootLayout() {
	const { isAuthenticated, user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Navigation */}
			<header className="border-b">
				<div className="container flex h-16 items-center justify-between px-4">
					<nav className="flex items-center space-x-6 text-sm font-medium">
						<Link
							to="/"
							className="transition-colors hover:text-foreground/80 text-foreground/60"
						>
							Home
						</Link>
						{isAuthenticated && (
							<Link
								to="/products"
								className="transition-colors hover:text-foreground/80 text-foreground/60"
							>
								Products
							</Link>
						)}
					</nav>

					<div className="flex items-center space-x-4">
						{isAuthenticated ? (
							<>
								<span className="text-sm text-muted-foreground">
									Welcome, {user?.username}
								</span>
								<Button variant="outline" onClick={handleLogout}>
									Logout
								</Button>
							</>
						) : (
							<>
								<Button variant="outline" asChild>
									<Link to="/login">Login</Link>
								</Button>
								<Button asChild>
									<Link to="/register">Register</Link>
								</Button>
							</>
						)}
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main>
				<Outlet />
			</main>
		</div>
	);
}
