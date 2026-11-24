
import { useEffect, useMemo, useState } from 'react'
import './App.css'

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Caffe Latte', desc: 'Smooth creamy espresso', price: 25000, stock: 20, cat: 'Coffee', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600' },
  { id: 2, name: 'Cappuccino', desc: 'Espresso with milk foam', price: 26000, stock: 20, cat: 'Coffee', img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600' },
  { id: 3, name: 'Americano', desc: 'Classic black coffee', price: 20000, stock: 20, cat: 'Coffee', img: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600' },
  { id: 4, name: 'Espresso', desc: 'Strong single shot', price: 22000, stock: 20, cat: 'Coffee', img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600' },
  { id: 5, name: 'Caramel Macchiato', desc: 'Espresso with caramel sauce', price: 29000, stock: 15, cat: 'Coffee', img: 'https://images.unsplash.com/photo-1485808191679-5f86510681a4?w=600' },
  { id: 6, name: 'Vanilla Latte', desc: 'Latte with vanilla syrup', price: 28000, stock: 15, cat: 'Coffee', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600' },
  { id: 7, name: 'Red Velvet Latte', desc: 'Red velvet creamy latte', price: 30000, stock: 12, cat: 'Coffee', img: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600' },
  { id: 8, name: 'Matcha Latte', desc: 'Japanese matcha blend', price: 28000, stock: 15, cat: 'Non-Coffee', img: 'https://images.unsplash.com/photo-1536013455962-2d9b9b47b7c8?w=600' },
  { id: 9, name: 'Chocolate Latte', desc: 'Rich chocolate milk', price: 27000, stock: 12, cat: 'Non-Coffee', img: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=600' },
  { id: 10, name: 'Strawberry Milk', desc: 'Fresh strawberry milk', price: 26000, stock: 15, cat: 'Non-Coffee', img: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600' },
  { id: 11, name: 'Thai Tea', desc: 'Thai orange sweet tea', price: 25000, stock: 15, cat: 'Non-Coffee', img: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=600' },
  { id: 12, name: 'Lemon Tea', desc: 'Fresh tea with lemon', price: 23000, stock: 15, cat: 'Non-Coffee', img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600' },
  { id: 13, name: 'Croissant', desc: 'Buttery French pastry', price: 22000, stock: 18, cat: 'Snack', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600' },
  { id: 14, name: 'Brownies', desc: 'Chocolate brownies', price: 24000, stock: 15, cat: 'Snack', img: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600' },
  { id: 15, name: 'Cheesecake', desc: 'Creamy blueberry cheesecake', price: 32000, stock: 10, cat: 'Snack', img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600' },
  { id: 16, name: 'French Fries', desc: 'Crispy golden fries', price: 20000, stock: 20, cat: 'Snack', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600' },
  { id: 17, name: 'Pancake Honey', desc: 'Fluffy pancake with honey', price: 28000, stock: 12, cat: 'Snack', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600' },
  { id: 18, name: 'Chicken Sandwich', desc: 'Grilled chicken sandwich', price: 30000, stock: 12, cat: 'Snack', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600' },
];

const money = value =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)

const readStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [products, setProducts] = useState(() =>
    readStorage('woro_products', INITIAL_PRODUCTS)
  )
  const [orders, setOrders] = useState(() =>
    readStorage('woro_orders', [])
  )

  const [page, setPage] = useState('Point of Sale')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const [cart, setCart] = useState([])
  const [orderType, setOrderType] = useState('Dine In')
  const [table, setTable] = useState('Table 1')
  const [discount, setDiscount] = useState('0')

  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [cashReceived, setCashReceived] = useState('')
  const [qrisPaid, setQrisPaid] = useState(false)

  const [receipt, setReceipt] = useState(null)
  const [productModal, setProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const [productForm, setProductForm] = useState({
    name: '',
    desc: '',
    price: '',
    stock: '',
    cat: 'Coffee',
    img: ''
  })

  useEffect(() => {
    localStorage.setItem('woro_products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('woro_orders', JSON.stringify(orders))
  }, [orders])

  const categories = [
    'All',
    ...new Set(products.map(product => product.cat))
  ]

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesCategory =
        category === 'All' || product.cat === category

      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  )

  const discountValue = Math.min(
    Math.max(Number(discount) || 0, 0),
    subtotal
  )

  const taxableAmount = subtotal - discountValue
  const tax = Math.round(taxableAmount * 0.10)
  const total = taxableAmount + tax

  const cash = Number(cashReceived) || 0
  const change = Math.max(cash - total, 0)

  const totalStock = products.reduce(
    (sum, product) => sum + product.stock,
    0
  )

  const lowStock = products.filter(
    product => product.stock > 0 && product.stock < 15
  ).length

  const addToCart = product => {
    if (product.stock <= 0) {
      alert('Stok produk habis.')
      return
    }

    const existing = cart.find(item => item.id === product.id)
    const currentQty = existing ? existing.qty : 0

    if (currentQty >= product.stock) {
      alert('Jumlah pesanan melebihi stok tersedia.')
      return
    }

    if (existing) {
      setCart(current =>
        current.map(item =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      )
    } else {
      setCart(current => [
        ...current,
        { ...product, qty: 1 }
      ])
    }
  }

  const updateQty = (id, amount) => {
    setCart(current =>
      current
        .map(item => {
          if (item.id !== id) return item

          const product = products.find(p => p.id === id)
          const nextQty = item.qty + amount

          if (nextQty > product.stock) {
            alert('Stok tidak mencukupi.')
            return item
          }

          return { ...item, qty: nextQty }
        })
        .filter(item => item.qty > 0)
    )
  }

  const removeFromCart = id => {
    setCart(current => current.filter(item => item.id !== id))
  }

  const resetCart = () => {
    setCart([])
    setDiscount('0')
    setCashReceived('')
    setQrisPaid(false)
  }

  const completePayment = () => {
    if (cart.length === 0) {
      alert('Keranjang masih kosong.')
      return
    }

    const stockChanged = cart.some(item => {
      const latestProduct = products.find(p => p.id === item.id)
      return !latestProduct || latestProduct.stock < item.qty
    })

    if (stockChanged) {
      alert('Stok berubah atau tidak mencukupi. Periksa kembali pesanan.')
      return
    }

    if (paymentMethod === 'Cash' && cash < total) {
      alert('Uang yang diterima belum mencukupi.')
      return
    }

    if (paymentMethod === 'QRIS' && !qrisPaid) {
      alert('Konfirmasi pembayaran QRIS simulasi terlebih dahulu.')
      return
    }

    const newOrder = {
      id: `WC-${Date.now()}`,
      date: new Date().toISOString(),
      items: cart.map(item => ({ ...item })),
      orderType,
      table: orderType === 'Dine In' ? table : 'Take Away',
      subtotal,
      discount: discountValue,
      tax,
      total,
      paymentMethod,
      cashReceived: paymentMethod === 'Cash' ? cash : total,
      change: paymentMethod === 'Cash' ? change : 0,
      status: 'Diproses'
    }

    setProducts(current =>
      current.map(product => {
        const orderedItem = cart.find(item => item.id === product.id)

        return orderedItem
          ? { ...product, stock: product.stock - orderedItem.qty }
          : product
      })
    )

    setOrders(current => [newOrder, ...current])
    setReceipt(newOrder)
    resetCart()
  }

  const updateOrderStatus = id => {
    setOrders(current =>
      current.map(order =>
        order.id === id
          ? {
              ...order,
              status:
                order.status === 'Diproses' ? 'Selesai' : 'Diproses'
            }
          : order
      )
    )
  }

  const openAddProduct = () => {
    setEditingProduct(null)
    setProductForm({
      name: '',
      desc: '',
      price: '',
      stock: '',
      cat: 'Coffee',
      img: ''
    })
    setProductModal(true)
  }

  const openEditProduct = product => {
    setEditingProduct(product.id)
    setProductForm({
      name: product.name,
      desc: product.desc,
      price: String(product.price),
      stock: String(product.stock),
      cat: product.cat,
      img: product.img
    })
    setProductModal(true)
  }

  const saveProduct = event => {
    event.preventDefault()

    const price = Number(productForm.price)
    const stock = Number(productForm.stock)

    if (
      !productForm.name.trim() ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      alert('Masukkan nama, harga, dan stok yang valid.')
      return
    }

    const productData = {
      ...productForm,
      name: productForm.name.trim(),
      price,
      stock,
      desc: productForm.desc.trim() || 'Freshly made for you',
      img: productForm.img.trim() ||
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600'
    }

    if (editingProduct !== null) {
      setProducts(current =>
        current.map(product =>
          product.id === editingProduct
            ? { ...product, ...productData }
            : product
        )
      )
    } else {
      setProducts(current => [
        ...current,
        { id: Date.now(), ...productData }
      ])
    }

    setProductModal(false)
  }

  const deleteProduct = id => {
    if (cart.some(item => item.id === id)) {
      alert('Produk sedang ada di keranjang. Hapus dari keranjang terlebih dahulu.')
      return
    }

    if (window.confirm('Hapus produk ini?')) {
      setProducts(current => current.filter(p => p.id !== id))
    }
  }

  const printReceipt = () => {
    window.print()
  }

  return (
    <div className="layout2">
      <aside className="side2 no-print">
        <div className="brand">
          <span className="logo-coffee">☕</span>
          <div>
            <b>WORO CAFE</b>
            <small>COFFEE & GOOD DAYS</small>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav>
          {[
            ['Dashboard', '▦'],
            ['Point of Sale', '▣'],
            ['Products', '☕'],
            ['Orders', '≡'],
            ['Reports', '▥']
          ].map(([name, icon]) => (
            <button
              key={name}
              className={page === name ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setPage(name)}
            >
              <span>{icon}</span>
              {name}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="avatar-w">W</span>
          <div>
            <b>Woro Admin</b>
            <small>Store Manager</small>
          </div>
        </div>
      </aside>

      <main className="main2">
        <div className="breadcrumb no-print">Woro Cafe / {page}</div>

        <header className="top-row no-print">
          <div>
            <h1>{page}</h1>
            <p>Let's make today a great coffee day.</p>
          </div>
          <div className="top-actions">
            <span className="date-pill">
              {new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
            <span className="avatar-w">W</span>
          </div>
        </header>

        {page === 'Point of Sale' && (
          <section className="pos-layout no-print">
            <div className="pos-left">
              <div className="pos-heading">
                <div>
                  <h2>New Order</h2>
                  <p>Select products to start an order.</p>
                </div>
                <span className="open-label">● POS Active</span>
              </div>

              <div className="order-options">
                <div>
                  <label>Order Type</label>
                  <div className="segmented">
                    {['Dine In', 'Take Away'].map(type => (
                      <button
                        key={type}
                        className={orderType === type ? 'selected' : ''}
                        onClick={() => setOrderType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {orderType === 'Dine In' && (
                  <div>
                    <label>Select Table</label>
                    <div className="table-options">
                      {['Table 1', 'Table 2', 'Table 3', 'Table 4'].map(t => (
                        <button
                          key={t}
                          className={table === t ? 'selected' : ''}
                          onClick={() => setTable(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="menu-toolbar">
                <div>
                  <h2>Menu Products</h2>
                  <p>Choose your customer's order.</p>
                </div>
                <input
                  type="search"
                  placeholder="Search menu..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="category-tabs">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={category === cat ? 'chosen' : ''}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="pos-product-grid">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    className="pos-product"
                    disabled={product.stock <= 0}
                    onClick={() => addToCart(product)}
                  >
                    <img src={product.img} alt={product.name} />
                    <div className="pos-product-info">
                      <b>{product.name}</b>
                      <strong>{money(product.price)}</strong>
                      <small>
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : 'Out of stock'}
                      </small>
                    </div>
                    <span className="add-symbol">＋</span>
                  </button>
                ))}

                {filteredProducts.length === 0 && (
                  <p className="empty-message">No products found.</p>
                )}
              </div>
            </div>

            <aside className="cart-panel">
              <div className="cart-heading">
                <div>
                  <h2>Current Order</h2>
                  <p>{orderType} {orderType === 'Dine In' ? `• ${table}` : ''}</p>
                </div>
                <span className="cart-count">{cart.reduce((s, i) => s + i.qty, 0)} items</span>
              </div>

              <div className="cart-items">
                {cart.length === 0 ? (
                  <div className="cart-empty">
                    <span>🛒</span>
                    <b>Your cart is empty</b>
                    <small>Select products to start an order.</small>
                  </div>
                ) : (
                  cart.map(item => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-top">
                        <div>
                          <b>{item.name}</b>
                          <small>{money(item.price)}</small>
                        </div>
                        <button
                          className="remove-item"
                          onClick={() => removeFromCart(item.id)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="cart-item-bottom">
                        <div className="qty-control">
                          <button onClick={() => updateQty(item.id, -1)}>−</button>
                          <strong>{item.qty}</strong>
                          <button onClick={() => updateQty(item.id, 1)}>＋</button>
                        </div>
                        <b>{money(item.price * item.qty)}</b>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="cart-calculation">
                <label>Discount (Rp)</label>
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                  placeholder="0"
                />

                <div className="calc-row">
                  <span>Subtotal</span>
                  <b>{money(subtotal)}</b>
                </div>
                <div className="calc-row">
                  <span>Discount</span>
                  <b>- {money(discountValue)}</b>
                </div>
                <div className="calc-row">
                  <span>Tax (10%)</span>
                  <b>{money(tax)}</b>
                </div>
                <div className="calc-total">
                  <span>Total</span>
                  <strong>{money(total)}</strong>
                </div>
              </div>

              <div className="payment-section">
                <label>Payment Method</label>
                <div className="payment-options">
                  {['Cash', 'QRIS'].map(method => (
                    <button
                      key={method}
                      className={paymentMethod === method ? 'selected' : ''}
                      onClick={() => {
                        setPaymentMethod(method)
                        setQrisPaid(false)
                      }}
                    >
                      {method === 'Cash' ? '💵' : '▦'} {method}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'Cash' ? (
                  <>
                    <label>Cash Received (Rp)</label>
                    <input
                      type="number"
                      min="0"
                      value={cashReceived}
                      onChange={e => setCashReceived(e.target.value)}
                      placeholder="Enter amount received"
                    />
                    <div className="change-box">
                      <span>Change</span>
                      <strong>{money(change)}</strong>
                    </div>
                    {cash > 0 && cash < total && (
                      <small className="error-text">
                        Uang masih kurang {money(total - cash)}
                      </small>
                    )}
                  </>
                ) : (
                  <div className="qris-box">
                    <div className="fake-qr">▦</div>
                    <b>QRIS Payment Simulation</b>
                    <small>Amount: {money(total)}</small>
                    <button
                      className={qrisPaid ? 'qris-confirmed' : ''}
                      onClick={() => setQrisPaid(true)}
                    >
                      {qrisPaid ? '✓ Payment Confirmed' : 'Simulate QRIS Paid'}
                    </button>
                    <small>Demo only — no real payment is processed.</small>
                  </div>
                )}

                <button
                  className="complete-btn"
                  disabled={
                    cart.length === 0 ||
                    (paymentMethod === 'Cash' && cash < total) ||
                    (paymentMethod === 'QRIS' && !qrisPaid)
                  }
                  onClick={completePayment}
                >
                  Complete Payment →
                </button>

                <button className="clear-cart" onClick={resetCart}>
                  Clear Order
                </button>
              </div>
            </aside>
          </section>
        )}

        {page === 'Products' && (
          <section className="no-print">
            <div className="pm-head">
              <div>
                <h2>Product Management</h2>
                <p>Manage your cafe products and stock.</p>
              </div>
              <button className="btn-add" onClick={openAddProduct}>
                ＋ Add Product
              </button>
            </div>

            <div className="summary-grid">
              <div className="summary-card">
                <span>Total Products</span>
                <strong>{products.length}</strong>
                <small>Products in your menu</small>
              </div>
              <div className="summary-card">
                <span>Total Stock</span>
                <strong>{totalStock}</strong>
                <small>Items available</small>
              </div>
              <div className="summary-card warning-card">
                <span>Low Stock</span>
                <strong>{lowStock}</strong>
                <small>Products need attention</small>
              </div>
              <div className="summary-card">
                <span>Out of Stock</span>
                <strong>{products.filter(p => p.stock === 0).length}</strong>
                <small>Products unavailable</small>
              </div>
            </div>

            <div className="product-toolbar">
              <div>
                <h2>All Products</h2>
                <p>{products.length} products in menu</p>
              </div>
              <input
                className="search-input"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="product-grid">
              {products.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase())
              ).map(product => (
                <article className="p-card" key={product.id}>
                  <div className="p-img-wrap">
                    <img src={product.img} alt={product.name} />
                    <span className="cat-pill">{product.cat}</span>
                    <span className={`stock-pill ${product.stock < 15 ? 'low' : ''}`}>
                      {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
                    </span>
                  </div>
                  <div className="p-body">
                    <h3>{product.name}</h3>
                    <p className="desc">{product.desc}</p>
                    <div className="price-row2">
                      <b>{money(product.price)}</b>
                    </div>
                    <div className="actions">
                      <button className="btn-edit" onClick={() => openEditProduct(product)}>
                        ✎ Edit
                      </button>
                      <button className="btn-del" onClick={() => deleteProduct(product.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {page === 'Orders' && (
          <section className="orders-page no-print">
            <div className="pm-head">
              <div>
                <h2>Order Management</h2>
                <p>Track and update customer orders.</p>
              </div>
              <span className="cart-count">{orders.length} total orders</span>
            </div>

            {orders.length === 0 ? (
              <div className="empty-state">
                <span>☕</span>
                <h3>No orders yet</h3>
                <p>Completed transactions will appear here.</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <article className="order-card" key={order.id}>
                    <div className="order-card-head">
                      <div>
                        <b>{order.id}</b>
                        <small>
                          {new Date(order.date).toLocaleString('id-ID')}
                        </small>
                      </div>
                      <span className={`status-pill ${
                        order.status === 'Selesai' ? 'done' : 'processing'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="order-meta">
                      <span>{order.table}</span>
                      <span>{order.paymentMethod}</span>
                      <b>{money(order.total)}</b>
                    </div>

                    <div className="order-items-summary">
                      {order.items.map(item => (
                        <span key={item.id}>
                          {item.name} × {item.qty}
                        </span>
                      ))}
                    </div>

                    <button
                      className={order.status === 'Selesai' ? 'btn-reopen' : 'btn-finish'}
                      onClick={() => updateOrderStatus(order.id)}
                    >
                      {order.status === 'Selesai'
                        ? 'Reopen Order'
                        : 'Mark as Selesai'}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {page === 'Dashboard' && (
          <section className="summary-grid no-print">
            <div className="summary-card">
              <span>Total Products</span>
              <strong>{products.length}</strong>
              <small>Products in menu</small>
            </div>
            <div className="summary-card">
              <span>Total Orders</span>
              <strong>{orders.length}</strong>
              <small>Recorded transactions</small>
            </div>
            <div className="summary-card">
              <span>Completed Orders</span>
              <strong>{orders.filter(o => o.status === 'Selesai').length}</strong>
              <small>Finished orders</small>
            </div>
            <div className="summary-card">
              <span>Total Sales</span>
              <strong>{money(orders.reduce((s, o) => s + o.total, 0))}</strong>
              <small>All recorded orders</small>
            </div>
          </section>
        )}

        {page === 'Reports' && (
          <section className="orders-page no-print">
            <div className="pm-head">
              <div>
                <h2>Sales Reports</h2>
                <p>Summary of recorded transactions.</p>
              </div>
            </div>
            <div className="summary-grid">
              <div className="summary-card">
                <span>Total Revenue</span>
                <strong>{money(orders.reduce((s, o) => s + o.total, 0))}</strong>
              </div>
              <div className="summary-card">
                <span>Total Orders</span>
                <strong>{orders.length}</strong>
              </div>
              <div className="summary-card">
                <span>Cash Payments</span>
                <strong>{orders.filter(o => o.paymentMethod === 'Cash').length}</strong>
              </div>
              <div className="summary-card">
                <span>QRIS Payments</span>
                <strong>{orders.filter(o => o.paymentMethod === 'QRIS').length}</strong>
              </div>
            </div>
          </section>
        )}
      </main>

      {productModal && (
        <div className="modal-overlay no-print" onClick={() => setProductModal(false)}>
          <form
            className="product-modal"
            onSubmit={saveProduct}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <p>Enter product information.</p>
              </div>
              <button type="button" className="modal-close" onClick={() => setProductModal(false)}>
                ×
              </button>
            </div>

            <label>Product Name</label>
            <input required value={productForm.name}
              onChange={e => setProductForm({ ...productForm, name: e.target.value })} />

            <label>Description</label>
            <input value={productForm.desc}
              onChange={e => setProductForm({ ...productForm, desc: e.target.value })} />

            <div className="form-row">
              <div>
                <label>Price (Rp)</label>
                <input required type="number" min="1" value={productForm.price}
                  onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
              </div>
              <div>
                <label>Stock</label>
                <input required type="number" min="0" step="1" value={productForm.stock}
                  onChange={e => setProductForm({ ...productForm, stock: e.target.value })} />
              </div>
            </div>

            <label>Category</label>
            <select value={productForm.cat}
              onChange={e => setProductForm({ ...productForm, cat: e.target.value })}>
              <option>Coffee</option>
              <option>Non-Coffee</option>
              <option>Snack</option>
            </select>

            <label>Image URL</label>
            <input value={productForm.img}
              onChange={e => setProductForm({ ...productForm, img: e.target.value })} />

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setProductModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-add">
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      {receipt && (
        <div className="receipt-overlay">
          <div className="receipt-modal">
            <div className="receipt-content">
              <div className="receipt-brand">
                <h2>WORO CAFE</h2>
                <p>COFFEE & GOOD DAYS</p>
                <small>Thank you for your order!</small>
              </div>

              <div className="receipt-divider" />

              <div className="receipt-detail">
                <span>Order ID</span><b>{receipt.id}</b>
                <span>Date</span>
                <b>{new Date(receipt.date).toLocaleString('id-ID')}</b>
                <span>Order Type</span><b>{receipt.table}</b>
                <span>Payment</span><b>{receipt.paymentMethod}</b>
              </div>

              <div className="receipt-divider" />

              {receipt.items.map(item => (
                <div className="receipt-line" key={item.id}>
                  <span>{item.name} × {item.qty}</span>
                  <b>{money(item.price * item.qty)}</b>
                </div>
              ))}

              <div className="receipt-divider" />

              <div className="receipt-line">
                <span>Subtotal</span><b>{money(receipt.subtotal)}</b>
              </div>
              <div className="receipt-line">
                <span>Discount</span><b>- {money(receipt.discount)}</b>
              </div>
              <div className="receipt-line">
                <span>Tax (10%)</span><b>{money(receipt.tax)}</b>
              </div>
              <div className="receipt-line receipt-total">
                <span>Total</span><b>{money(receipt.total)}</b>
              </div>
              <div className="receipt-line">
                <span>Cash Received</span><b>{money(receipt.cashReceived)}</b>
              </div>
              <div className="receipt-line">
                <span>Change</span><b>{money(receipt.change)}</b>
              </div>

              <div className="receipt-divider" />
              <p className="receipt-thanks">Have a wonderful day ☕</p>
            </div>

            <div className="receipt-actions no-print">
              <button className="btn-cancel" onClick={() => setReceipt(null)}>
                Close
              </button>
              <button className="btn-add" onClick={printReceipt}>
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
