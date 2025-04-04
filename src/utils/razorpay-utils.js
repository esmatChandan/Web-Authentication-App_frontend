// razorpay-utils.js
export const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  
  export const displayRazorpay = async (amount, orderId, onSuccess) => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
  
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }
  
    const options = {
      key: 'YOUR_RAZORPAY_KEY',
      amount: amount * 100,
      currency: 'INR',
      name: "Mom's Made Delights",
      description: 'Order Payment',
      order_id: orderId,
      handler: function (response) {
        onSuccess(response);
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#F37254',
      },
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };