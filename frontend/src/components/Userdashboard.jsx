import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import { useNavigate } from 'react-router-dom'
import { Categories } from '../category'
import CategoryCard from './CategoryCard'
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard';

const Userdashboard = () => {
  const categoryCarouselRef = useRef(null)
  const categoryAnimationRef = useRef(null)
  const navigate = useNavigate()
   
  const {currentCity , shopInMyCity , itemsInMyCity , searchItems} = useSelector(state => state.user)
  const [updatedItemList , setUpdatedItemList] = useState(itemsInMyCity || [])

  const carouselCategories = [...Categories, ...Categories]
  
  useEffect(()=>{
    if(itemsInMyCity && itemsInMyCity.length > 0){
      setUpdatedItemList(itemsInMyCity)
    }
  }, [itemsInMyCity])

  const handleFilterByCategory = (category)=>{
    if(category === "all"){
      setUpdatedItemList(itemsInMyCity)
    }
    else{
      const filtered = itemsInMyCity?.filter(i=> i.category === category)
      setUpdatedItemList(filtered)
    }
  }
  
  useEffect(() => {
    const carousel = categoryCarouselRef.current
    if (!carousel || Categories.length === 0) return

    const halfWidth = carousel.scrollWidth / 2
    carousel.scrollLeft = halfWidth

    let isPaused = false
    const speed = 0.45

    const animate = () => {
      if (!carousel) return
      if (!isPaused) {
        carousel.scrollLeft -= speed
        if (carousel.scrollLeft <= 0) {
          carousel.scrollLeft += halfWidth
        } else if (carousel.scrollLeft >= halfWidth) {
          carousel.scrollLeft -= halfWidth
        }
      }
      categoryAnimationRef.current = window.requestAnimationFrame(animate)
    }

    categoryAnimationRef.current = window.requestAnimationFrame(animate)

    const pause = () => {
      isPaused = true
    }

    const resume = () => {
      isPaused = false
    }

    carousel.addEventListener('mouseenter', pause)
    carousel.addEventListener('mouseleave', resume)
    carousel.addEventListener('touchstart', pause, { passive: true })
    carousel.addEventListener('touchend', resume)

    return () => {
      if (categoryAnimationRef.current) {
        window.cancelAnimationFrame(categoryAnimationRef.current)
      }
      carousel.removeEventListener('mouseenter', pause)
      carousel.removeEventListener('mouseleave', resume)
      carousel.removeEventListener('touchstart', pause)
      carousel.removeEventListener('touchend', resume)
    }
  }, [])

 

  return (
     <div>
         <Nav/>

         {Array.isArray(searchItems) && (
          <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4'>
            <h1 className='text-gray-900 text-2xl  sm:text-3xl font-semibold border-b border-gray-200 pb-2 '>Search Result</h1>
            {searchItems.length > 0 ? (
              <div className='w-full auto flex flex-wrap gap-6 justify-center'>
                {searchItems.map((item)=>(
                  <FoodCard key={item._id || item.id} data={item} />
                ))}
              </div>
            ) : (
              <p className='text-sm text-gray-500'>No matching items or outlets found.</p>
            )}
          </div>
         )}

         <div className='w-full max-w-6xl flex flex-col  gap-5 px-12 items-center p-[10px] '>
           <h1 className='text-gray-800 text-2xl items-start  sm:text-3xl'>Inspiration for you first order</h1>

           <div className='w-full overflow-hidden'>
             <div className='flex items-center gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden' ref={categoryCarouselRef}>
               {carouselCategories.map((cate , idx)=>(
                 <CategoryCard name={cate.category} image={cate.image} key={`${cate.category}-${idx}`} onClick={()=>handleFilterByCategory(cate.category)} />
               ) )}
             </div>
           </div>

         </div>

         <div className='w-full max-w-6xl flex flex-col gap-5 items-center p-[10px] ' >
           <h1 className='w-full text-center text-gray-800 text-2xl sm:text-3xl'>Best Options in {currentCity}</h1>

             <div className='w-full flex flex-wrap items-center justify-center gap-4 pb-2'>
               {shopInMyCity && shopInMyCity.length > 0 && shopInMyCity.map((shop, idx) => (
              <CategoryCard name={shop.name} image={shop.image} key={idx} onClick={()=>navigate(`/shop/${shop._id}`)} />
              
           ))}
             </div>

         </div>

          <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
            <main className='min-w-0'>
                <div className='flex flex-col gap-5 items-center p-[10px]'>
                  <h1 className='text-gray-800 text-2xl items-start sm:text-3xl'> Suggested Food Items</h1>

                  <div className='w-full h-auto flex flex-wrap gap-[20px] justify-center'>
                    {updatedItemList && updatedItemList.length > 0 && updatedItemList.map((item , idx)=>(
                      <FoodCard key={idx} data={item} />
                    ))}
                  </div>
                </div>
            </main>
          </div>
     </div>
  )
}

export default Userdashboard
