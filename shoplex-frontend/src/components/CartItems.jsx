import React from 'react'
import Minus from '../assets/minus.svg'
import Plus from '../assets/plus.svg'

const CartItems = ({item,updateCart,removeFromCart}) => {
      const [quantity, setQuantity] = useState(item.quantity);
      
      useEffect(() => {
          const item = cart.items?.find((item) => item.product.id === product.id);
          setQuantity(item ? item.quantity : 0);
      }, [cart, product.id]);

      const handleIncrease = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        updateCart(product, newQuantity);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            updateCart(product, newQuantity);
        } else {
            setQuantity(0);
            removeFromCart(product.id);
        }
    };

  return (
    <div className=''>
      <div className="img"><img src={item.product.imageUrl} alt="" /></div>
      <div className="content">
        <h1>{item.product.name}</h1>
        <h1>{item.product.price}</h1>
        <div className="quantity">
            <button onClick={()=>handleDecrease}><img src={Minus} alt="" /></button>
            <span>{quantity}</span>
            <button onClick={()=>handleIncrease}><img src={Plus} alt="" /></button>
        </div>
      </div>

    </div>
  )
}

export default CartItems
