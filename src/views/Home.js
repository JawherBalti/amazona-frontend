import React, { useEffect } from 'react'
import Products from '../components/Products';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../actions/products';

export default function Home() {
  const productList = useSelector(state => state.productsListReducer)
  const { products, loading, error } = productList

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  return (
    <div className='home'>
      {
        loading ? (<LoadingBox></LoadingBox>) :
          error ? (<MessageBox variant={"danger"}>{error}</MessageBox>) :
            (<div className="row center">
              {products.map(product => (
                <Products key={product._id} product={product}></Products>
              ))}
            </div>)
      }
    </div>
  )
}
