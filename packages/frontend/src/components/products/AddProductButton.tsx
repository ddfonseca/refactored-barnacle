import { useState } from 'react';
import { ProductModal } from './ProductModal';

interface AddProductButtonProps {
  onProductAdded: () => void;
}

export function AddProductButton({ onProductAdded }: AddProductButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
      >
        Add Product
      </button>

      {isModalOpen && (
        <ProductModal
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            setIsModalOpen(false);
            onProductAdded();
          }}
        />
      )}
    </>
  );
}
