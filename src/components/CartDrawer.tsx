import React from "react";
import {
  XIcon,
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "../store/api/cartApi";
import { SafeImage } from "./SafeImage";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { data: cart, isLoading } = useGetCartQuery(undefined, {
    skip: !isOpen,
  });
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    updateCartItem({ itemId, quantity });
  };

  const handleRemoveItem = (itemId: string) => {
    removeCartItem(itemId);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gradient-start z-50 shadow-2xl transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-5 border-b border-gray-800">
            <h2 className="text-xl font-bold flex items-center">
              <ShoppingCartIcon className="w-5 h-5 mr-2" />
              Your Cart
            </h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-white transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-5 space-y-5">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading...</p>
              </div>
            ) : !cart || cart.cart_items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCartIcon className="w-16 h-16 text-text-secondary mb-4" />
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-text-secondary mb-6">
                  Looks like you haven't added any competitions to your cart
                  yet.
                </p>
                <button onClick={onClose} className="btn-premium">
                  Browse Competitions
                </button>
              </div>
            ) : (
              cart.cart_items.map((item) => (
                <div
                  key={item._id}
                  className="flex border-b border-gray-800 pb-5"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <SafeImage
                      src={item.competition_image_url}
                      alt={item.competition_title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <Link
                      to={`/competition/${item.competition_slug}`}
                      className="font-medium hover:text-accent transition-colors line-clamp-2"
                    >
                      {item.competition_title}
                    </Link>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full bg-gradient-end flex items-center justify-center"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="mx-3 w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full bg-gradient-end flex items-center justify-center"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold mr-3">
                          £{(item.ticket_price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart && cart.cart_items.length > 0 && (
            <div className="p-5 border-t border-gray-800 bg-gradient-end">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-medium">
                    £{cart.summary.total_price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700">
                  <span>Total</span>
                  <span>£{cart.summary.total_price.toFixed(2)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block w-full btn-premium text-center"
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
