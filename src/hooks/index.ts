import type {AppDispatch, RootState} from '@/stores'

import type {TypedUseSelectorHook} from 'react-redux'
import {useDispatch, useSelector} from 'react-redux'

export const useGo: () => AppDispatch = useDispatch
export const useStore: TypedUseSelectorHook<RootState> = useSelector

export {usePieces} from './usePieces'
export {useRemoteGo} from './useRemoteGo'
