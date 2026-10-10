const createPayment = async (amount) => {
  return {
    success: true,
    amount,
    message: "Payment service ready",
  };
};

export default createPayment;