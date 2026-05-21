import supabase from "./supabase";

// Authentication Service
export const authService = {
  async signUp(email, password, role, additionalData) {
    try {
      // Sign up user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            ...additionalData
          }
        }
      });

      if (signUpError) throw signUpError;
      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  async signIn(email, password, role) {
    if (role) {
      const { data: buyerData, error: roleError } = await supabase
        .from('buyers')
        .select('id, role')
        .eq('email', email)
        .maybeSingle();

      if (roleError) {
        throw new Error('Role verification failed. Please try again.');
      }

      if (!buyerData || buyerData.role !== role) {
        throw new Error(`This email is not registered as a ${role}.`);
      }

      if (role === 'seller') {
        const { data: sellerData, error: sellerError } = await supabase
          .from('sellers')
          .select('seller_id')
          .eq('seller_id', buyerData.id)
          .maybeSingle();

        if (sellerError || !sellerData) {
          throw new Error('This email is not registered as a seller.');
        }
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const role = user.user_metadata?.role;
      let userData = null;

      if (role === 'seller') {
        const { data, error } = await supabase
          .from('sellers')
          .select('*')
          .eq('seller_id', user.id)
          .maybeSingle();

        if (error) throw error;
        // Inject user_type, role, and email from auth since they aren't in sellers table by default
        userData = data ? { ...data, user_type: 'seller', role: 'seller', email: user.email } : null;

        // Self-heal: create missing seller profile from auth metadata
        // sellers table has FK to buyers, so we need to create a buyers row first
        if (!userData) {
          const meta = user.user_metadata || {};
          // Step 1: Ensure a buyers row exists (required by FK)
          const { data: existingBuyer } = await supabase
            .from('buyers')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();

          if (!existingBuyer) {
            const { error: buyerErr } = await supabase
              .from('buyers')
              .insert({
                id: user.id,
                full_name: meta.username || meta.full_name || '',
                email: user.email,
                role: 'seller'
              });
            if (buyerErr) {
              console.error('Failed to create base buyer profile for seller:', buyerErr);
            }
          }

          // Step 2: Create the sellers row
          const { data: newSeller, error: insertErr } = await supabase
            .from('sellers')
            .insert({
              seller_id: user.id,
              store_name: meta.storeName || meta.store_name || 'My Store',
              description: meta.storeDescription || meta.store_description || ''
            })
            .select()
            .single();

          if (insertErr) {
            console.error('Failed to create seller profile:', insertErr);
          } else {
            userData = { ...newSeller, user_type: 'seller', role: 'seller', email: user.email };
          }
        }
      } else {
        const { data, error } = await supabase
          .from('buyers')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        userData = data ? { ...data, user_type: 'buyer', role: data.role || 'buyer' } : null;

        // Self-heal: create missing buyer profile from auth metadata
        if (!userData) {
          const meta = user.user_metadata || {};
          const { data: newBuyer, error: insertErr } = await supabase
            .from('buyers')
            .insert({
              id: user.id,
              full_name: meta.username || meta.full_name || '',
              email: user.email,
              role: 'buyer'
            })
            .select()
            .single();

          if (insertErr) {
            console.error('Failed to create buyer profile:', insertErr);
          } else {
            userData = { ...newBuyer, user_type: 'buyer', role: newBuyer.role || 'buyer' };
          }
        }
      }

      if (!userData) {
        console.error('Could not find or create profile for user:', user.id);
        await supabase.auth.signOut();
        return null;
      }
      return userData;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },
  
  async getProfile(userId) {
    try {
      // Fetch from both tables concurrently since we don't know the role from userId alone
      const [buyerRes, sellerRes] = await Promise.all([
        supabase.from('buyers').select('*').eq('id', userId).maybeSingle(),
        supabase.from('sellers').select('*').eq('seller_id', userId).maybeSingle()
      ]);

      if (buyerRes.error) throw buyerRes.error;
      if (sellerRes.error) throw sellerRes.error;
      
      if (sellerRes.data) {
        return {
          ...sellerRes.data,
          user_type: 'seller'
        };
      }
      
      if (buyerRes.data) {
        return {
          ...buyerRes.data,
          user_type: 'buyer'
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
};

// Product Service
export const productService = {
  async getProductById(productId) {
    const { data, error } = await supabase
      .from('products')
      .select('*, sellers(store_name)')
      .eq('id', productId)
      .single();

    if (error) throw error;
    return data;
  },

  async createProduct(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select();

    if (error) throw error;
    return data[0];
  },

  async updateProduct(productId, productData) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deleteProduct(productId) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
  },

  async getSellerProducts(sellerId) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', sellerId);

    if (error) throw error;
    return data;
  },

  async getAllProducts(filters = {}) {
    let query = supabase.from('products').select('*, sellers(store_name)');

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }
};

// Order Service
export const orderService = {
  async createOrder(orderData) {
    const sellerId = orderData.items[0]?.seller_id;
    const shippingAddress = `${orderData.shippingInfo.fullName}, ${orderData.shippingInfo.address}, ${orderData.shippingInfo.city}, ${orderData.shippingInfo.postalCode}, ${orderData.shippingInfo.phone}`;

    // 1. Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: orderData.userId,
        seller_id: sellerId,
        total_amount: orderData.totalAmount,
        status: orderData.status,
        shipping_address: shippingAddress
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Insert order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id || item.id,
      quantity: item.quantity,
      price_at_purchase: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. Clear database cart
    const { error: cartError } = await supabase
      .from('cart_items')
      .delete()
      .eq('buyer_id', orderData.userId);

    if (cartError) {
      console.error('Failed to clear database cart after order creation:', cartError);
    }

    return order;
  },

  async updateOrderStatus(orderId, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select();

    if (error) throw error;
    return data[0];
  },

  async getSellerOrders(sellerId) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), buyers(full_name)')
      .eq('seller_id', sellerId);

    if (error) throw error;
    return data;
  },

  async getBuyerOrders(buyerId) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), sellers(store_name)')
      .eq('buyer_id', buyerId);

    if (error) throw error;
    return data;
  }
};

// Cart Service
export const cartService = {
  async addToCart(userId, productId, quantity) {
    // Check if product already in cart
    const { data: existingCartItem, error: existingError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('buyer_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existingCartItem) {
      // Update quantity if item exists
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingCartItem.quantity + quantity })
        .eq('id', existingCartItem.id);

      if (error) throw error;
      return data;
    } else {
      // Add new cart item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          buyer_id: userId,
          product_id: productId,
          quantity
        })
        .select();

      if (error) throw error;
      return data[0];
    }
  },

  async removeFromCart(cartItemId) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;
  },

  async getUserCart(userId) {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('buyer_id', userId);

    if (error) throw error;
    return data;
  }
};

// Seller Profile Service
export const sellerService = {
  async getSellerProfile(sellerId) {
    const { data, error } = await supabase
      .from('sellers')
      .select('*, products(*)')
      .eq('seller_id', sellerId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateSellerProfile(sellerId, profileData) {
    const { data, error } = await supabase
      .from('sellers')
      .update(profileData)
      .eq('seller_id', sellerId)
      .select();

    if (error) throw error;
    return data[0];
  }
};