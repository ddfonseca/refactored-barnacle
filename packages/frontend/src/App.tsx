import { ProductList } from './components/products/ProductList';
import { AddProductButton } from './components/products/AddProductButton';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Inventory Management
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="flex justify-end mb-4">
                <AddProductButton onProductAdded={() => window.location.reload()} />
              </div>
              <div className="rounded-lg bg-white shadow">
                <ProductList />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
