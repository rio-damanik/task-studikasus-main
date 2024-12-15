// src/components/Product/Product.jsx
import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import "./Product.css";
import { fetchProducts } from "../../services/api";

// const allProducts = [
//   { id: 1, name: "Burger", price: 10000, description: "Juicy beef burger with lettuce.", tags: ["food"] },
//   { id: 2, name: "Cake", price: 5000, description: "Homemade chocolate cake.", tags: ["food", "pretty"] },
//   { id: 3, name: "Hot Coffee", price: 3000, description: "Freshly brewed coffee.", tags: ["drink"] },
//   { id: 4, name: "Cold Coffee", price: 4000, description: "Refreshing iced coffee.", tags: ["drink"] },
//   { id: 5, name: "Pizza", price: 12000, description: "Cheesy pepperoni pizza.", tags: ["food"] },
//   { id: 6, name: "Sandwich", price: 7000, description: "Ham and cheese sandwich.", tags: ["food"] },
//   { id: 7, name: "Smoothie", price: 5000, description: "Mixed berry smoothie.", tags: ["drink"] },
//   { id: 8, name: "Chips", price: 2000, description: "Crispy potato chips.", tags: ["pretty"] },
//   { id: 9, name: "Tea", price: 2000, description: "Hot green tea.", tags: ["drink"] },
//   { id: 10, name: "Ice Cream", price: 3000, description: "Vanilla ice cream.", tags: ["pretty"] },
//   { id: 11, name: "Salad", price: 8000, description: "Fresh vegetable salad.", tags: ["food"], image: "path/to/salad.jpg" },
//   { id: 12, name: "Fries", price: 4000, description: "Crispy french fries.", tags: ["pretty"], image: "path/to/fries.jpg" },
// ];

// Rupiah formatting function
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
};

const Product = () => {
  const [productList,setProductList] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  const filteredProducts = selectedTag ? productList.filter((product) => product.tags.includes(selectedTag)) : productList;

  useEffect(()=>{
    fetchProducts.then((res)=>res.json()).then((res)=>{
      setProductList(res.products);
      
    }).catch((err)=>{
      console.log(err);
      
    })
  },[])

  const addToCart = (product) => {
    console.log(`${product.name} added to cart!`); // Fixed template literal syntax
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag); // Toggle tag selection
  };

  return (
    <div className="product-container">
      <h2>Products {selectedTag && `- ${selectedTag.toUpperCase()}`}</h2> {/* Fixed template literal syntax */}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product._id}>
            <img src={product.image || "https://via.placeholder.com/100"} alt={product.name} className="product-image" />
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description?product.description:""}</p>
              <div className="product-tags">
                {product.tags.map((tag, index) => (
                  <button key={index} className="tag-button" onClick={() => handleTagClick(tag._id)}>
                    {tag.name}
                  </button>
                ))}
              </div>
              <p className="product-price">{formatRupiah(product.price)}</p>
              <button className="add-to-cart-button" onClick={() => addToCart(product)}>
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
