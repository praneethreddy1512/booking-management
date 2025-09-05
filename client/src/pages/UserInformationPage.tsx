import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const UserInformationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}users/create`, formData);
      if (!response) {
        toast.error("Failed to create user");
      }

      const data =  response;
      console.log("User created:", data);

      if (data) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          notes: "",
        });
        toast.success("User created successfully!");
        navigate("/review" );
      }
    } catch (error) {
      toast.error("Error creating user:" + error);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:underline mb-2"
          >
            ← Back to time slots
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Information
          </h2>
          <p className="text-gray-600">Please provide your contact details</p>
        </div>

        <form className="space-y-4" onSubmit={(e)=>handleSubmit(e)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your address (optional)"
              rows={3}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any special requests or notes?"
              rows={3}
            />
          </div>

          <button
            type="submit"
          
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Continue to Review
          </button>
        </form>
      </div>
    </>
  );
};

export default UserInformationPage;
