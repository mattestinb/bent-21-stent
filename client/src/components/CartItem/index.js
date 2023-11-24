import React from 'react';
import { useStoreContext } from "../../utils/GlobalState";
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
import { Box, Typography, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartItem = ({ item }) => {
  const [, dispatch] = useStoreContext();

  const handleRemoveFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: item._id
    });
    idbPromise('cart', 'delete', { ...item });
  };

  const handleChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity === 0) {
      handleRemoveFromCart();
    } else {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: item._id,
        purchaseQuantity: newQuantity
      });
      idbPromise('cart', 'put', { ...item, purchaseQuantity: newQuantity });
    }
  };

  return (
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} md={4}>
          <Box display="flex" justifyContent="center">
            <img src={`/images/${item.image}`} alt={item.name} />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box display="flex" flexDirection="column">
            <Typography variant="subtitle1">{item.name}, ${item.price}</Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="body2">Qty:</Typography>
              <input type="number" placeholder="1" value={item.purchaseQuantity} onChange={handleChange} />
              <IconButton aria-label="delete" onClick={handleRemoveFromCart}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
  );
};

export default CartItem;
