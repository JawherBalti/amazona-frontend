import {
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_FAIL,
  GET_PRODUCTS_SUCCESS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  GET_ADMIN_PRODUCTS_REQUEST,
  GET_ADMIN_PRODUCTS_SUCCESS,
  GET_ADMIN_PRODUCTS_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_RESET,
} from "../actions/types";

export const productsListReducer = (
  state = { loading: false, products: [] },
  action
) => {
  switch (action.type) {
    case GET_PRODUCTS_REQUEST:
      return { loading: true };
    case GET_PRODUCTS_SUCCESS:
      return { loading: false, products: action.payload };
    case GET_PRODUCTS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const adminProductsReducer = (
  state = { loading: false, products: [] },
  action
) => {
  switch (action.type) {
    case GET_ADMIN_PRODUCTS_REQUEST:
      return { ...state, loading: true };
    case GET_ADMIN_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case GET_ADMIN_PRODUCTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productDetailsReducer = (
  state = { product: {}, loading: false },
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true };
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload };
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productDeleteReducer = (
  state = { loading: false, products: [] },
  action
) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { ...state, loadingDelete: true, successDelete: false };
    case PRODUCT_DELETE_SUCCESS:
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case PRODUCT_DELETE_FAIL:
      return { ...state, loadingDelete: false, successDelete: false };
    case PRODUCT_DELETE_RESET:
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
