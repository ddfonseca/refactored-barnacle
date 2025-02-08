import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./components/layout/RootLayout";
import { HomePage } from "./pages/home";
import { ProductsPage } from "./pages/products";
import { LoginPage } from "./pages/auth/login";
import { RegisterPage } from "./pages/auth/register";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: "products",
				element: (
					<ProtectedRoute>
						<ProductsPage />
					</ProtectedRoute>
				),
			},
			{
				path: "login",
				element: <LoginPage />,
			},
			{
				path: "register",
				element: <RegisterPage />,
			},
		],
	},
]);

function App() {
	return (
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	);
}

export default App;
