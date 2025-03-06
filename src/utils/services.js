import supabase from "./supabase";

// Authentication Service
export const authService = {
  async signUp(email, password, role, additionalData) {
    try {
      // Sign up user
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

      // Insert additional user details into users table
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user?.id,
          email,
          username: additionalData.username,
          role
        });

      if (insertError) throw insertError;

      // If seller, insert seller-specific details
      if (role === 'seller') {
        const { error: sellerError } = await supabase
          .from('sellers')
          .insert({
            id: data.user?.id,
            store_name: additionalData.storeName,
            store_description: additionalData.storeDescription
          });

        if (sellerError) throw sellerError;
      }

      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  async signIn(email, password) {
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Fetch additional user details
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return userData;
  }
};

// Product Service
export const productService = {
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
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select();

    if (error) throw error;
    return data[0];
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
      .select('*, order_items(*), users(username)')
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
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existingError && existingError.code !== 'PGRST116') throw existingError;

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
          user_id: userId,
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
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }
};

// Seller Profile Service
export const sellerService = {
  async getSellerProfile(sellerId) {
    const { data, error } = await supabase
      .from('sellers')
      .select('*, users(email), products(*))')
      .eq('id', sellerId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateSellerProfile(sellerId, profileData) {
    const { data, error } = await supabase
      .from('sellers')
      .update(profileData)
      .eq('id', sellerId)
      .select();

    if (error) throw error;
    return data[0];
  }
};