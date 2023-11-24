import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { loadStripe } from '@stripe/stripe-js';
import { Box, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CartItem from '../CartItem';
import { useStoreContext } from '../../utils/GlobalState';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import Auth from '../../utils/auth';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';
import './style.css';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = () => {
  const [state, dispatch] = useStoreContext();
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  useEffect(() => {
    if (!state.cart.length) {
      const fetchCartItems = async () => {
        const cartItems = await idbPromise('cart', 'get');
        dispatch({ type: ADD_MULTIPLE_TO_CART, products: cartItems });
      };
      fetchCartItems();
    }
  }, [state.cart.length, dispatch]);

  useEffect(() => {
    if (data) {
      window.location.href = '/checkout';
    }
  }, [data]);

  const toggleCart = () => {
    dispatch({ type: TOGGLE_CART });
  };

  const calculateTotal = () => {
    return state.cart.reduce((sum, item) => sum + item.price * item.purchaseQuantity, 0).toFixed(2);
  };

  const submitCheckout = () => {
    window.location.href = '/checkout';
  };

  if (!state.cartOpen) {
    return (
        <div className="cart-closed" onClick={toggleCart}>
          <span role="img" aria-label="cart">🛒</span>
        </div>
    );
  }

  return (
      <Box className="cart">
        <Box className="close" onClick={toggleCart}>
          <CloseIcon />
        </Box>
        <Typography variant="h2">Shopping Cart</Typography>
        {state.cart.length ? (
            <Box>
              {state.cart.map(item => <CartItem key={item._id} item={item} />)}
              <Box display="flex" justifyContent="space-between">
                <strong>Total: ${calculateTotal()}</strong>
                {Auth.loggedIn() ? (
                    <Button variant="contained" onClick={submitCheckout}>Checkout</Button>
                ) : (
                    <Typography>(log in to check out)</Typography>
                )}
              </Box>
            </Box>
        ) : (
            <Typography variant="h6">Your cart is empty!</Typography>
        )}
      </Box>
  );
};

export default Cart;
