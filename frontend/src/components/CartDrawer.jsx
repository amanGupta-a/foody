import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CartPanel from './CartPanel'
import { closeCartDrawer, openCartDrawer } from '../redux/userSlice'
import { calculateCartSummary } from '../utils/cartPricing'
import { IoCartOutline } from 'react-icons/io5'

const CartDrawer = () => {
  const dispatch = useDispatch()
  const { isCartDrawerOpen, cartItems } = useSelector(state => state.user)
  const cartCount = cartItems.length
  const totalAmount = calculateCartSummary(cartItems).total

  return (
    <>
      {!isCartDrawerOpen && (
        <button
          type='button'
          onClick={() => dispatch(openCartDrawer())}
          className='fixed bottom-[15px] right-[15px] z-[60] flex items-center gap-3 rounded-2xl border border-[#ff7f63] bg-[#ff4d2d] px-3.5 py-2.5 text-white shadow-[0_16px_34px_rgba(255,77,45,0.34)] transition hover:-translate-y-0.5 hover:bg-[#f44425] sm:bottom-5 sm:right-5 sm:px-4 sm:py-3'
          aria-label='Open cart'
        >
          <span className='relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/18 sm:h-10 sm:w-10'>
            <IoCartOutline size={20} />
            <span className='absolute -right-1.5 -top-1.5 min-w-[1.15rem] rounded-full bg-white px-1.5 text-center text-[10px] font-bold leading-5 text-[#ff4d2d]'>
              {cartCount}
            </span>
          </span>

          <div className='flex flex-col items-start leading-tight'>
            <span className='text-xs font-medium'>{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
            {totalAmount > 0 ? <span className='text-sm font-bold'>₹ {totalAmount}</span> : null}
          </div>

          <span className='hidden rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold sm:inline-flex'>Cart</span>
        </button>
      )}

      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isCartDrawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div
          className='absolute inset-0 bg-black/45'
          onClick={() => dispatch(closeCartDrawer())}
        />

        <div className={`absolute inset-x-0 bottom-0 max-h-[88vh] overflow-hidden bg-white shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition-transform duration-300 ease-out lg:inset-y-0 lg:right-0 lg:left-auto lg:bottom-auto lg:top-0 lg:h-full lg:w-[380px] lg:max-h-none lg:rounded-l-[2rem] ${isCartDrawerOpen ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-x-full'}`}> 
          <button
            type='button'
            onClick={() => dispatch(closeCartDrawer())}
            className='absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-2 text-lg font-semibold text-slate-600 shadow-sm hover:text-slate-900'
          >
            ×
          </button>

          <div className='h-full overflow-y-auto p-4 pt-5'>
            <CartPanel />
          </div>
        </div>
      </div>
    </>
  )
}

export default CartDrawer