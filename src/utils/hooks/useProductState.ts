import { useReducer } from 'react';
import { Product, Variation } from '@/utils/functions/interfaces';

interface ProductState {
  product: Product | null;
  loading: boolean;
  errorMessage: string | null;
  quantity: number;
  selectedAttributes: { [key: string]: string };
  selectedVariation: Variation | null;
  selectedColor: string | null;
  showModal: boolean;
  snackbar: {
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  };
}

const initialState: ProductState = {
  product: null,
  loading: true,
  errorMessage: null,
  quantity: 1,
  selectedAttributes: {},
  selectedVariation: null,
  selectedColor: null,
  showModal: false,
  snackbar: {
    visible: false,
    message: '',
    type: 'success',
  },
};

type Action =
  | { type: 'SET_PRODUCT'; payload: Product }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'UPDATE_ATTRIBUTE'; payload: { name: string; value: string } }
  | { type: 'SET_VARIATION'; payload: Variation | null }
  | { type: 'SHOW_SNACKBAR'; payload: { message: string; type: 'success' | 'error' } }
  | { type: 'HIDE_SNACKBAR' }
  | { type: 'SET_QUANTITY'; payload: number }
  | { type: 'TOGGLE_MODAL'; payload: boolean };

function productReducer(state: ProductState, action: Action): ProductState {
  switch (action.type) {
    case 'SET_PRODUCT':
      return { ...state, product: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, errorMessage: action.payload, loading: false };
    case 'UPDATE_ATTRIBUTE':
      return {
        ...state,
        selectedAttributes: {
          ...state.selectedAttributes,
          [action.payload.name]: action.payload.value,
        },
      };
    case 'SET_VARIATION':
      return { ...state, selectedVariation: action.payload };
    case 'SHOW_SNACKBAR':
      return {
        ...state,
        snackbar: { visible: true, message: action.payload.message, type: action.payload.type },
      };
    case 'HIDE_SNACKBAR':
      return { ...state, snackbar: { ...state.snackbar, visible: false } };
    case 'SET_QUANTITY':
      return { ...state, quantity: action.payload };
    case 'TOGGLE_MODAL':
      return { ...state, showModal: action.payload };
    default:
      return state;
  }
}

export const useProductState = () => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  return { state, dispatch };
};
