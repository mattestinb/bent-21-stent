import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {
  const [state, dispatch] = useStoreContext();
  const { categories } = state;
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if (categoryData) {
      dispatch({ type: UPDATE_CATEGORIES, categories: categoryData.categories });
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then(fetchedCategories => {
        dispatch({ type: UPDATE_CATEGORIES, categories: fetchedCategories });
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleCategoryClick = (id) => {
    dispatch({ type: UPDATE_CURRENT_CATEGORY, currentCategory: id });
  };

  return (
      <div>
        <h2>Choose a Category:</h2>
        {categories.map(category => (
            <button key={category._id} onClick={() => handleCategoryClick(category._id)}>
              {category.name}
            </button>
        ))}
      </div>
  );
}

export default CategoryMenu;
