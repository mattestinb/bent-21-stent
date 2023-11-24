import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';
import { useStoreContext } from "../utils/GlobalState";
import {
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
  UPDATE_PRODUCTS,
} from '../utils/actions';
import Cart from '../components/Cart';
import { idbPromise } from "../utils/helpers";

function Detail() {
  const { id } = useParams();
  const [currentProduct, setCurrentProduct] = useState({});
  const { loading, data } = useQuery(QUERY_PRODUCTS);
  const [state, dispatch] = useStoreContext();
  const { products, cart } = state;

  useEffect(() => {
    if (products.length) {
      setCurrentProduct(products.find(product => product._id === id));
    } else if (data) {
      dispatch({ type: UPDATE_PRODUCTS, products: data.products });
      data.products.forEach(product => idbPromise('products', 'put', product));
    } else if (!loading) {
      idbPromise('products', 'get').then(indexedProducts => {
        dispatch({ type: UPDATE_PRODUCTS, products: indexedProducts });
      });
    }
  }, [products, data, loading, id, dispatch]);

  const addToCart = () => {
    const item = cart.find(cartItem => cartItem._id === id);
    if (item) {
      dispatch({ type: UPDATE_CART_QUANTITY, _id: id, purchaseQuantity: parseInt(item.purchaseQuantity) + 1 });
      idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(item.purchaseQuantity) + 1 });
    } else {
      dispatch({ type: ADD_TO_CART, product: { ...currentProduct, purchaseQuantity: 1 } });
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  };

  const removeFromCart = () => {
    dispatch({ type: REMOVE_FROM_CART, _id: currentProduct._id });
    idbPromise('cart', 'delete', { ...currentProduct });
  };

  return (
      <>
        {loading && <img src={spinner} alt="loading" />}
        {currentProduct && (
            <div className="container my-1">
              <Link to="/">← Back to Products</Link>
              <h2>{currentProduct.name}</h2>
              <p>{currentProduct.description}</p>
              <p>
                <strong>Price:</strong>${currentProduct.price}{' '}
                <button onClick={addToCart}>Add to cart</button>
                <button disabled={!cart.find(p => p._id === currentProduct._id)} onClick={removeFromCart}>
                  Remove from Cart
                </button>
              </p>
              <img src={`/images/${currentProduct.image}`} alt={currentProduct.name} />
            </div>
        )}
        <Cart />
      </>
  );
}

export default Detail;
