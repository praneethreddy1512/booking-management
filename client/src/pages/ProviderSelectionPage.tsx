import React from "react";
import { Clock, Mail, Phone, DollarSign } from "lucide-react";
import axios from "axios";  

import { useEffect, useState } from "react";
import { Link,useLocation } from "react-router-dom";


interface Provider {
  _id: string | number;
  name: string;
  service: string;
  phone: string;
  email: string;
  workingHours: {
    start: string; 
    end: string;   
  };
  hourlyRate: number | string; 
}

const ProviderSelectionPage: React.FC = () => {
  const location = useLocation();
  const category = location.pathname.split("/").pop();
  console.log("Category:", category);

  const [providers, setProviders] = useState<Provider[]>([]);

  const fetchProviders = async (category: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}providers/get/category/${category}`
      );
      if (response.status === 200) {
        setProviders(response.data);
      } else {
        console.error("Failed to fetch providers:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  useEffect(() => {
    fetchProviders(category as string);
  }, [category]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <button className="text-blue-600 hover:underline mb-2" onClick={() => window.history.back()}>
          ← Back to services
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Provider
        </h2>
        <p className="text-gray-600">Select a provider for your service</p>
      </div>

      <div className="space-y-4">
        {providers.map((provider) => (
          <Link 
            key={provider._id}
            to={`/slots/${provider._id}`}
            className="block"
          >
            <div
              className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {provider.name}
                  </h3>
                  <p className="text-gray-600 capitalize mb-2">
                    {provider.service}
                  </p>
                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {provider.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {provider.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {provider.workingHours.start} - {provider.workingHours.end}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    {provider.hourlyRate}/hr
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProviderSelectionPage;
