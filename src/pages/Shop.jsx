import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Card({ children, className }) {
  return (
    <div className={`w-full overflow-hidden rounded-lg border bg-white shadow-md hover:shadow-lg transition-shadow ${className}`}>
      {children}
    </div>
  );
}

export default function Shop() {
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('https://unversty-2.onrender.com/users/6736489a0ef973f3f1448e86')
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(error => console.error("Error fetching user data:", error));
  }, []);

  useEffect(() => {
    fetch('https://unversty-2.onrender.com/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Error fetching product data:", error));
  }, []);


  const openConfirmationModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);

  };

  const closeConfirmationModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handlePurchase = async () => {
    if (userData && userData.tokens[0].quantity >= selectedProduct.cost && selectedProduct.quantity > 0) {
      try {
        const updatedProduct = await axios.put(`https://unversty-2.onrender.com/products/${selectedProduct._id}`, {
          quantity: selectedProduct.quantity - 1
        });

        const updatedUser = await axios.put(`https://unversty-2.onrender.com/users/${userData._id}`, {
          tokens: [
            {
              quantity: userData.tokens[0].quantity - selectedProduct.cost
            }
          ]
        });

        await axios.post('https://unversty-2.onrender.com/purchases', {
          userId: userData._id,
          userName: userData.name,
          productId: selectedProduct._id,
          productName: selectedProduct.name,
          cost: selectedProduct.cost,
          status: 'ожидает выдачи',
          purchaseDate: new Date().toISOString()
        });

        setUserData(updatedUser.data);
        setProducts(prevProducts => prevProducts.map(p =>
          p._id === selectedProduct._id ? updatedProduct.data : p
        ));

        closeConfirmationModal();
        alert(`Вы успешно купили ${selectedProduct.name} за ${selectedProduct.cost} монет.`);
      } catch (error) {
        console.error("Error updating purchase data:", error);
        alert("Произошла ошибка при обработке покупки. Пожалуйста, попробуйте еще раз.");
      }
    } else {
      alert("Недостаточно монет или товар закончился.");
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-6">
      <div className="sticky top-0 bg-white z-10 shadow-md">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 sm:px-6">
          <div className="text-base md:text-lg lg:text-xl font-bold text-[#4A66D3]">Shop</div>

          <div className="flex items-center gap-7 md:gap-4 lg:gap-6">
            <Link to="/history" className="hidden md:flex items-center text-[#4A66D3] hover:text-[#3a51a6] transition-colors">
              <Clock className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              <span className="text-sm md:text-base">Xaridlar tarixi</span>
            </Link>
            <div className="text-[#4A66D3] font-semibold text-sm md:text-base">
              Монеты: {userData ? userData.tokens[0].quantity : 0}
            </div>
            <Link to='/history' className="md:hidden text-[#4A66D3]">
              <Clock className='w-5 h-5' />
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 py-4 md:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <Card key={product._id || product.id} className="flex flex-col ">
              <div className="relative flex-grow">
                <img
                  src={product.img}
                  alt={product.name}
                  className="h-40 sm:h-48 w-full object-contain p-2"
                />
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-base md:text-lg font-semibold">{product.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="flex items-center text-base md:text-lg font-bold text-[#1e3a8a]">
                      {product.cost} Монет
                    </span>
                    <span className="text-xs md:text-sm text-gray-600">
                      {product.quantity} dona mavjud
                    </span>
                  </div>
                </div>
                <button
                  className="w-full bg-[#4A66D3] pointer text-white py-2 px-4 rounded text-sm md:text-base hover:bg-[#3a51a6] transition-colors mt-4"
                  onClick={() => openConfirmationModal(product)}
                  disabled={!userData || userData.tokens[0].quantity < product.cost || product.quantity === 0}
                >
                  {userData && userData.tokens[0].quantity < product.cost || product.quantity === 0 ? 'Недостаточно средств' : 'Купить'}
                </button>

              </div>
            </Card>
          ))}
        </div>
      </div>

      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-[90%]">
            <h2 className="text-xl font-bold mb-4">Подтверждение покупки</h2>
            <p className="mb-4">Вы действительно хотите купить этот продукт?</p>
            <div className="mb-4">
              <img
                src={selectedProduct.img}
                alt={selectedProduct.name}
                className="h-40 w-full object-contain mb-2"
              />
              <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
              <p className="text-sm text-gray-600">Стоимость: {selectedProduct.cost} Монет</p>
              <p className="text-sm text-gray-600">Доступно: {selectedProduct.quantity} шт.</p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                onClick={closeConfirmationModal}
              >
                Отмена
              </button>
              <button
                className="px-4 py-2 bg-[#4A66D3] text-white rounded hover:bg-[#3a51a6] transition-colors"
                onClick={handlePurchase}
              >
                Подтвердить покупку
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}