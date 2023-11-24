import React, { useEffect } from 'react';
import ProductItem from '../ProductItem';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_PRODUCTS } from '../../utils/actions';
import { useQuery } from '@apollo/client';
import { QUERY_ALL_PRODUCTS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import spinner from '../../assets/spinner.gif';

function ProductList() {
  const [state, dispatch] = useStoreContext();
  const { currentCategory, products } = state;
  const { loading, data } = useQuery(QUERY_ALL_PRODUCTS);

  useEffect(() => {
    if (data) {
      dispatch({ type: UPDATE_PRODUCTS, products: data.products });
      data.products.forEach(product => idbPromise('products', 'put', product));
    } else if (!loading) {
      idbPromise('products', 'get').then(fetchedProducts => {
        dispatch({ type: UPDATE_PRODUCTS, products: fetchedProducts });
      });
    }
  }, [data, loading, dispatch]);

  const getFilteredProducts = () => {
    if (!currentCategory) return products;
    return products.filter(product => product.category._id === currentCategory);
  };

  return (
      <div className="my-2">
        <h2>Products:</h2>
        {products.length ? (
            <div className="flex-row">
              {getFilteredProducts().map(product => (
                  <ProductItem
                      key={product._id}
                      _id={product._id}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      quantity={product.quantity}
                  />
              ))}
            </div>
        ) : (
            <h3>You haven't added any products yet!</h3>
        )}
        {loading && <img src={spinner} alt="loading" />}
      </div>
  );
}

export default ProductList;
