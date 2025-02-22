import { DataView } from 'primereact/dataview'
import React,{ useState,useEffect } from 'react'
import { useNavigate } from 'react-router'
const Form = ({ product }) => {
    const [openForm, setopenForm] = useState(false)
    const [selectedProduct, setselectedProduct] = useState(product)
    const [existingProducts, setexistingProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate();
    useEffect(() => {
      fetch('http://localhost:8080/shoplex/home/products', { method: 'GET' })
            .then(res => res.json())
            .then(json => {
                setexistingProducts(json)
            })
    }, [openForm])
    
    function addProduct(data){
        fetch('http://localhost:8080/shoplex/vendor/addproduct', {
          method: 'POST',
          body: data,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }}).then(res => res.text())
          .then(text => {console.log(text)
            navigate(-1)
          })
    }
    function handleForm(e){
        e.preventDefault();
        let form = e.target;
        let formData = new FormData(form);
        let file = formData.get('image');
        let productData = {
          name: formData.get('name'),
          description: formData.get('description'),
          category: formData.get('category'),
          brand: formData.get('brand'),
          dimensions: formData.get('dimensions'),
          weight: formData.get('weight')
        };
    
        let data = {
          product: productData,
          price: formData.get('price'),
          quantity: formData.get('quantity')
        };
        formData.forEach((value, key) => {formData.delete(key)});
        formData.append('product',JSON.stringify(data));
        formData.append('file',file);
        addProduct(formData);
        
      }
      const filteredProducts = existingProducts.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const itemTemplate = (product,index)=>{
        return <div key={product.id} className='w-3/4 m-7'>
         <div className="product flex gap-12 w-full justify-around bg-gray-200 p-3 rounded-lg">
          <img className="rounded-lg" src={product.imageUrl} width="180" alt="" />
          <div className=' translate-y-8'>
          <h1 className='text-4xl'>{product.name}</h1>
          <p className='text-lg'>{product.category},{product.brand}</p>
          </div>
          <button className=' translate-y-6 w-34 h-28 cursor-pointer bg-amber-600 rounded-2xl text-white' onClick={()=>{setselectedProduct(product)
           setopenForm(true)}}>
            Add To Your Inventory
          </button>
         </div>
        </div>
      }
      const listTemplate = (items) => {
          if(!items || items.length===0) return null;
          let list = items.map((product,index)=>{
            return itemTemplate(product,index);
          })
          return <div className="grid grid-nogutter">{list}</div>;
      }
  return (
    <div className='h-screen bg-white shadow-lg flex justify-center items-center gap-6'>
      <div className="form w-3/4 overflow-y-scroll h-full flex flex-col gap-12 m-4">
        <h1 className='text-4xl m-5 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text'>Add New Product</h1>
        { openForm ? 
        <form onSubmit={handleForm} className='flex flex-col gap-4 items-center justify-center text-xl m-3 flex-wrap'>
          <div className='flex flex-row'>
           <div className='flex flex-col'>
            <input type="number" name="id" value={selectedProduct?.id} hidden/>
            <input type="text" id="name" name="name" className='border-2 rounded-lg m-2 p-2' placeholder='Product Name' value={selectedProduct?.name}/>
            <input type="text" id="desc" name="description" className='border-2 rounded-lg m-2 p-2' placeholder='Description' value={selectedProduct?.description}/>
            <input type="text" id="category" name="category" className='border-2 rounded-lg m-2 p-2' placeholder='Category' value={selectedProduct?.category}/>
            <input type="text" id="brand" name="brand" className='border-2 rounded-lg m-2 p-2' placeholder='Brand' value={selectedProduct?.brand}/>
            <input type="number" id="weight" name="weight" className='border-2 rounded-lg m-2 p-2' placeholder='Weight' value={selectedProduct?.weight} />
            <input type="file" id="image" name="image" className='border-2 rounded-lg m-2 p-2' placeholder='Image' />
            </div>
            <div className='flex flex-col'>
            <input type="number" id="price" name="price" className='border-2 rounded-lg m-2 p-2' placeholder='Price' value={product?.price} />
            <input type="number" id="quantity" name="quantity" className='border-2 rounded-lg m-2 p-2' placeholder='Quantity' value={product?.quantity} />
            </div>
            </div>
            <button type="submit" className='cursor-pointer h-16 w-32 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 p-2 text-white m-2 rounded-full'>Add Product</button>
          
        </form>:
        <div className="products">
          <h1>Choose Products to Sell</h1>
          <input
            type="text"
            placeholder="Search Products"
            className="border-2 rounded-lg m-2 p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className=''>
            <DataView value={filteredProducts} listTemplate={listTemplate}/>
            
          </div>
          <p className='text-xl fixed bottom-32'>Not found what you are looking for? <button className=' text-blue-600 cursor-pointer' onClick={()=>setopenForm(true)}>Add New Product</button></p>
        </div>
        }
      </div>
    </div>
  )
}

export default Form
