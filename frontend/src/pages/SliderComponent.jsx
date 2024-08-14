import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const SliderComponent = ({ items }) => {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      navigation={true}
      modules={[Navigation]}
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>
          <div>
            <img src={item.imageUrl} alt={item.type} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default SliderComponent
