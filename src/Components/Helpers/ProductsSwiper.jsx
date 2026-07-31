"use client";

import React, { useRef, useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";

import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import axios from "axios";
import SkeletonCard from "./SkeletonCard";
import dynamic from "next/dynamic";

// dynamic/lazy loading show skeleton while down loading products data
const ProductCard = dynamic(() => import("../Helpers/ProductCard"), {
  loading: () => <SkeletonCard />,
});

export default function ProductsSwiper({ word1, word2 = word1 }) {
  // get Featured Top
  const [products, setProducts] = useState([]);
  useEffect(() => {
    async function getProducts() {
      await axios
        .get("/assist/productsData/products.json")
        .then((res) => {
          setProducts(res.data);
          console.log(res.data);
        })
        .catch((error) => console.log(error));
    }
    getProducts();
  }, []);

  const useSwiperRef = () => {
    const [wrapper, setWrapper] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
      if (ref.current) {
        setWrapper(ref.current);
      }
    }, []);

    return [wrapper, ref];
  };

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [nextEl, nextElRef] = useSwiperRef();
  const [prevEl, prevElRef] = useSwiperRef();

  return (
    <Swiper
      spaceBetween={16}
      slidesPerView={3}
      loop
      modules={[Navigation, Autoplay]}
      navigation={{ prevEl, nextEl }}
      onInit={(swiper) => {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
        swiper.navigation.update();
      }}
      breakpoints={{
        320: { slidesPerView: 1.5 },
        991: { slidesPerView: 3.5 },
      }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
    >
      {/* prev button ------------------------------ */}
      <Button
        variant="contained"
        // color="shift"
        sx={{
          minWidth: "35px",
          height: 35,
          p: 0,
          position: "absolute",
          top: "50%",
          left: 0,
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
        ref={prevElRef}
      >
        <KeyboardArrowLeft />
      </Button>
      {/* next button ------------------------------ */}
      <Button
        variant="contained"
        // color="shift"
        sx={{
          minWidth: "35px",
          height: 35,
          p: 0,
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
        ref={nextElRef}
      >
        <KeyboardArrowRight />
      </Button>
      {products &&
        products.map(
          (item, i) =>
            (item.filter.includes(word1) || item.filter.includes(word2)) && (
              <SwiperSlide key={`slide_${i}`} style={{ paddingBottom: "20px" }}>
                {/* reusable Product card --------------------- */}
                <ProductCard item={item} />
              </SwiperSlide>
            ),
        )}
    </Swiper>
  );
}
