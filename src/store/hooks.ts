import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './index';

/**
 * Pre-typed versions of the react-redux hooks. Without them every component
 * would have to annotate the state and dispatch types by hand, and thunks
 * would not type-check against the plain useDispatch signature.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
