import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80'

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Caffe Latte', desc: 'Smooth creamy espresso', price: 25000, stock: 20, cat: 'Coffee', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80' },
  { id: 2, name: 'Cappuccino', desc: 'Espresso with milk foam', price: 26000, stock: 20, cat: 'Coffee', img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80' },
  { id: 3, name: 'Americano', desc: 'Classic black coffee', price: 20000, stock: 20, cat: 'Coffee', img: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600&q=80' },
  { id: 4, name: 'Espresso', desc: 'Strong single shot espresso', price: 18000, stock: 25, cat: 'Coffee', img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80' },
  { id: 5, name: 'Caramel Macchiato', desc: 'Espresso, milk & caramel', price: 29000, stock: 15, cat: 'Coffee', img: 'https://images.unsplash.com/photo-1485808191679-5f86510681a4?w=600&q=80' },
  { id: 6, name: 'Vanilla Latte', desc: 'Latte with vanilla syrup', price: 27000, stock: 18, cat: 'Coffee', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80' },
  { id: 7, name: 'Matcha Latte', desc: 'Japanese matcha blend', price: 28000, stock: 15, cat: 'Non-Coffee', img: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&q=80' },
  { id: 8, name: 'Chocolate Latte', desc: 'Rich chocolate milk', price: 27000, stock: 12, cat: 'Non-Coffee', img: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=600&q=80' },
  { id: 9, name: 'Red Velvet Latte', desc: 'Creamy red velvet drink', price: 30000, stock: 10, cat: 'Non-Coffee', img: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&q=80' },
  { id: 10, name: 'Strawberry Milk', desc: 'Fresh strawberry milk', price: 26000, stock: 14, cat: 'Non-Coffee', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80' },
  { id: 11, name: 'Thai Tea', desc: 'Sweet Thai tea with milk', price: 22000, stock: 20, cat: 'Non-Coffee', img: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=600&q=80' },
  { id: 12, name: 'Lemon Tea', desc: 'Fresh lemon iced tea', price: 20000, stock: 22, cat: 'Non-Coffee', img: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&q=80' },
  { id: 13, name: 'Croissant', desc: 'Buttery French pastry', price: 22000, stock: 18, cat: 'Snack', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80' },
  { id: 14, name: 'Brownies', desc: 'Choco brownies cake', price: 24000, stock: 12, cat: 'Snack', img: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&q=80' },
  { id: 15, name: 'Cheesecake', desc: 'Soft creamy cheesecake', price: 32000, stock: 8, cat: 'Snack', img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80' },
  { id: 16, name: 'French Fries', desc: 'Crispy golden fries', price: 18000, stock: 25, cat: 'Snack', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80' },
  { id: 17, name: 'Chicken Sandwich', desc: 'Grilled chicken sandwich', price: 35000, stock: 10, cat: 'Snack', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80' },
  { id: 18, name: 'Pancake Honey', desc: 'Fluffy pancake + honey', price: 28000, stock: 9, cat: 'Snack', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80' },
]

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
    readStorage('woro_products_v2', INITIAL_PRODUCTS)
  )
  const [orders, setOrders] = useState(() =>
    readStorage('woro_orders_v2', [])
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

  const [orderSearch, setOrderSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [reportPeriod, setReportPeriod] = useState('7 Days')

  const paymentLock = useRef(false)

  const [productForm, setProductForm] = useState({
    name: '',
    desc: '',
    price: '',
    stock: '',
    cat: 'Coffee',
    img: ''
  })

  useEffect(() => {
    localStorage.setItem('woro_products_v2', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('woro_orders_v2', JSON.stringify(orders))
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

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

  const completedOrders = orders.filter(
    order => order.status === 'Selesai'
  ).length

  const averageOrder = orders.length
    ? totalRevenue / orders.length
    : 0

  const totalItemsSold = orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.qty, 0),
    0
  )

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.items.some(item =>
        item.name.toLowerCase().includes(orderSearch.toLowerCase())
      )
    const matchesStatus =
      statusFilter === 'All' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const reportOrders = orders.filter(order => {
    if (reportPeriod === 'All') return true
    const orderDate = new Date(order.date)
    const now = new Date()
    if (reportPeriod === 'Today') {
      return orderDate.toDateString() === now.toDateString()
    }
    const days = reportPeriod === '7 Days' ? 7 : 30
    const startDate = new Date()
    startDate.setDate(now.getDate() - (days - 1))
    startDate.setHours(0, 0, 0, 0)
    return orderDate >= startDate && orderDate <= now
  })

  const reportRevenue = reportOrders.reduce(
    (sum, order) => sum + order.total,
    0
  )

  const reportItems = reportOrders.reduce(
    (sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.qty, 0),
    0
  )

  const bestSellingProducts = Object.values(
    reportOrders.reduce((result, order) => {
      order.items.forEach(item => {
        if (!result[item.id]) {
          result[item.id] = {
            id: item.id,
            name: item.name,
            qty: 0,
            revenue: 0
          }
        }
        result[item.id].qty += item.qty
        result[item.id].revenue += item.price * item.qty
      })
      return result
    }, {})
  ).sort((a, b) => b.qty - a.qty)

  const paymentBreakdown = ['Cash', 'QRIS'].map(method => {
    const methodOrders = reportOrders.filter(
      order => order.paymentMethod === method
    )
    return {
      method,
      count: methodOrders.length,
      revenue: methodOrders.reduce((sum, order) => sum + order.total, 0)
    }
  })

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
    if (paymentLock.current) return
    if (cart.length === 0) {
      alert('Keranjang masih kosong.')
      return
    }
    const invalidItem = cart.find(item => {
      const latestProduct = products.find(p => p.id === item.id)
      return !latestProduct || latestProduct.stock < item.qty
    })
    if (invalidItem) {
      alert(`Stok ${invalidItem.name} tidak mencukupi. Periksa keranjang.`)
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
    paymentLock.current = true
    const newOrder = {
      id: `WC-${Date.now()}`,
      date: new Date().toISOString(),
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty
      })),
      orderType,
      table: orderType === 'Dine In' ? table : 'Take Away',
      subtotal,
      discount: discountValue,
      tax,
      taxRate: 10,
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
        order.id === id && order.status === 'Diproses'
          ? { ...order, status: 'Selesai' }
          : order
      )
    )
  }

  const reopenReceipt = order => {
    setReceipt(order)
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
      img: productForm.img.trim() || FALLBACK_IMG
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
                  <p>Choose your customer's order. ({filteredProducts.length} menu)</p>
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
                    <img src={product.img} alt={product.name} onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMG }} />
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
                <label>Discount (Rp) - Nominal</label>
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
                    <img src={product.img} alt={product.name} onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMG }} />
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
                <p>Track, review, and update customer orders.</p>
              </div>
              <span className="cart-count">{orders.length} total orders</span>
            </div>

            <div className="orders-toolbar">
              <input
                type="search"
                placeholder="Search order ID or product..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
              />

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <span>☕</span>
                <h3>No orders found</h3>
                <p>Try another search or complete a new transaction.</p>
              </div>
            ) : (
              <div className="orders-list">
                {filteredOrders.map(order => (
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
                      {order.items.map((item, index) => (
                        <span key={`${order.id}-${item.id}-${index}`}>
                          {item.name} × {item.qty}
                        </span>
                      ))}
                    </div>

                    <div className="order-actions">
                      <button
                        className="btn-view"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </button>

                      <button
                        className="btn-view"
                        onClick={() => reopenReceipt(order)}
                      >
                        Print Receipt
                      </button>

                      {order.status === 'Diproses' && (
                        <button
                          className="btn-finish"
                          onClick={() => updateOrderStatus(order.id)}
                        >
                          Mark as Selesai
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="orders-footer">
              <span>Diproses: {orders.filter(o => o.status === 'Diproses').length}</span>
              <span>Selesai: {completedOrders}</span>
            </div>
          </section>
        )}

        {page === 'Dashboard' && (
          <section className="no-print">
            <div className="summary-grid">
              <div className="summary-card">
                <span>Total Revenue</span>
                <strong>{money(totalRevenue)}</strong>
                <small>All recorded transactions</small>
              </div>

              <div className="summary-card">
                <span>Total Orders</span>
                <strong>{orders.length}</strong>
                <small>{completedOrders} completed orders</small>
              </div>

              <div className="summary-card">
                <span>Total Products</span>
                <strong>{products.length}</strong>
                <small>{totalStock} items in stock</small>
              </div>

              <div className="summary-card warning-card">
                <span>Low Stock</span>
                <strong>{lowStock}</strong>
                <small>Products need attention</small>
              </div>
            </div>

            <div className="report-card dashboard-recent">
              <div className="dashboard-section-head">
                <div>
                  <h3>Recent Orders</h3>
                  <p>Your latest customer transactions.</p>
                </div>

                <button
                  className="btn-view"
                  onClick={() => setPage('Orders')}
                >
                  View All
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="report-empty">No transactions recorded yet.</div>
              ) : (
                orders.slice(0, 5).map(order => (
                  <div className="dashboard-order-row" key={order.id}>
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

                    <strong>{money(order.total)}</strong>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {page === 'Reports' && (
          <section className="orders-page no-print">
            <div className="pm-head">
              <div>
                <h2>Sales Reports</h2>
                <p>Business performance based on recorded transactions.</p>
              </div>

              <select
                className="report-filter"
                value={reportPeriod}
                onChange={e => setReportPeriod(e.target.value)}
              >
                <option value="Today">Today</option>
                <option value="7 Days">Last 7 Days</option>
                <option value="30 Days">Last 30 Days</option>
                <option value="All">All Time</option>
              </select>
            </div>

            <div className="summary-grid">
              <div className="summary-card">
                <span>Total Revenue</span>
                <strong>{money(reportRevenue)}</strong>
                <small>Based on selected period</small>
              </div>

              <div className="summary-card">
                <span>Total Orders</span>
                <strong>{reportOrders.length}</strong>
                <small>Recorded transactions</small>
              </div>

              <div className="summary-card">
                <span>Items Sold</span>
                <strong>{reportItems}</strong>
                <small>Total product quantities</small>
              </div>

              <div className="summary-card">
                <span>Average Order Value</span>
                <strong>
                  {money(reportOrders.length ? reportRevenue / reportOrders.length : 0)}
                </strong>
                <small>Average revenue per order</small>
              </div>
            </div>

            <div className="report-grid">
              <div className="report-card">
                <h3>Best Selling Products</h3>
                <p>Products ranked by quantity sold.</p>

                {bestSellingProducts.length === 0 ? (
                  <div className="report-empty">No sales data yet.</div>
                ) : (
                  bestSellingProducts.slice(0, 5).map((item, index) => (
                    <div className="report-product-row" key={item.id}>
                      <div className="rank-number">{index + 1}</div>
                      <div className="report-product-info">
                        <b>{item.name}</b>
                        <small>{item.qty} items sold</small>
                      </div>
                      <strong>{money(item.revenue)}</strong>
                    </div>
                  ))
                )}
              </div>

              <div className="report-card">
                <h3>Payment Methods</h3>
                <p>Transactions by payment method.</p>

                {paymentBreakdown.map(item => (
                  <div className="payment-report-row" key={item.method}>
                    <div>
                      <b>{item.method}</b>
                      <small>{item.count} transactions</small>
                    </div>
                    <strong>{money(item.revenue)}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="report-card report-table-card">
              <h3>Recent Transactions</h3>
              <p>Transactions included in this report.</p>

              {reportOrders.length === 0 ? (
                <div className="report-empty">No transactions in this period.</div>
              ) : (
                <div className="report-table-wrap">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {reportOrders.map(order => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{new Date(order.date).toLocaleDateString('id-ID')}</td>
                          <td>{order.paymentMethod}</td>
                          <td>{order.status}</td>
                          <td>{money(order.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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

      {selectedOrder && (
        <div
          className="modal-overlay no-print"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="product-modal order-detail-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Order Details</h2>
                <p>{selectedOrder.id}</p>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>

            <div className="detail-meta">
              <span>Date</span>
              <b>{new Date(selectedOrder.date).toLocaleString('id-ID')}</b>

              <span>Order Type</span>
              <b>{selectedOrder.table}</b>

              <span>Payment</span>
              <b>{selectedOrder.paymentMethod}</b>

              <span>Status</span>
              <b>{selectedOrder.status}</b>
            </div>

            <h3 className="detail-title">Ordered Items</h3>

            {selectedOrder.items.map((item, index) => (
              <div className="receipt-line" key={`${item.id}-${index}`}>
                <span>{item.name} × {item.qty}</span>
                <b>{money(item.price * item.qty)}</b>
              </div>
            ))}

            <div className="receipt-divider" />

            <div className="receipt-line">
              <span>Subtotal</span>
              <b>{money(selectedOrder.subtotal)}</b>
            </div>

            <div className="receipt-line">
              <span>Discount</span>
              <b>- {money(selectedOrder.discount)}</b>
            </div>

            <div className="receipt-line">
              <span>Tax (10%)</span>
              <b>{money(selectedOrder.tax)}</b>
            </div>

            <div className="receipt-line receipt-total">
              <span>Total</span>
              <b>{money(selectedOrder.total)}</b>
            </div>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>

              <button
                className="btn-add"
                onClick={() => {
                  setReceipt(selectedOrder)
                  setSelectedOrder(null)
                }}
              >
                Print Receipt
              </button>
            </div>
          </div>
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
                <span>Payment</span><b>{receipt.paymentMethod}{receipt.paymentMethod === 'QRIS' ? ' (Simulasi)' : ''}</b>
              </div>

              <div className="receipt-divider" />

              {receipt.items.map((item, index) => (
                <div className="receipt-line" key={`${item.id}-${index}`}>
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
                <span>{receipt.paymentMethod === 'Cash' ? 'Cash Received' : 'QRIS Paid'}</span>
                <b>{money(receipt.cashReceived)}</b>
              </div>

              {receipt.paymentMethod === 'Cash' && (
                <div className="receipt-line">
                  <span>Change</span>
                  <b>{money(receipt.change)}</b>
                </div>
              )}

              <div className="receipt-divider" />
              <p className="receipt-thanks">Have a wonderful day ☕</p>
              {receipt.paymentMethod === 'QRIS' && (
                <p className="receipt-thanks">QRIS - Simulasi, bukan pembayaran sungguhan</p>
              )}
            </div>

            <div className="receipt-actions no-print">
              <button
                className="btn-cancel"
                onClick={() => {
                  setReceipt(null)
                  paymentLock.current = false
                }}
              >
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