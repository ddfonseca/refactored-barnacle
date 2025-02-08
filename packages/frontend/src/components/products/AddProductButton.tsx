import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductModal } from './ProductModal';

interface AddProductButtonProps {
  onProductAdded: () => void;
}

export function AddProductButton({ onProductAdded }: AddProductButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>

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
