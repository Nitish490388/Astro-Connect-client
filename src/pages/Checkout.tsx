
const Checkout = () => {
  return (
    <div>Checkout</div>
  )
}

export default Checkout



// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosClient from "@/utils/axiosClient";

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// export default function Checkout() {
//   const { appointmentId } = useParams();
//   const [amount, setAmount] = useState(500); // static or fetch from backend

//   const handlePayment = async () => {
//     const { data } = await axiosClient.post("/api/payments/create", {
//       appointmentId,
//       amount,
//     });

//     const options = {
//       key: data.key,
//       amount: data.amount,
//       currency: data.currency,
//       name: "Astrology App",
//       description: "Appointment Payment",
//       order_id: data.orderId,
//       handler: async (response: any) => {
//         await axiosClient.post("/api/payments/verify", response);
//         alert("Payment successful!");
//       },
//       prefill: {
//         name: "Nitish Kumar Jena",
//         email: "nitish@example.com",
//       },
//       theme: { color: "#3399cc" },
//     };

//     const razorpay = new window.Razorpay(options);
//     razorpay.open();
//   };

//   return (
//     <div className="max-w-md mx-auto mt-20 text-center">
//       <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>
//       <p className="text-gray-700 mb-6">Pay ₹{amount} for your appointment.</p>
//       <button onClick={handlePayment} className="bg-blue-500 text-white px-6 py-2 rounded">
//         Pay Now
//       </button>
//     </div>
//   );
// }