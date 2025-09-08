import React, { useEffect, useState } from "react";
import { Clock, Mail, Phone, DollarSign } from "lucide-react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

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
  const { category } = useParams<{ category: string }>();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchProviders = async (category: string) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}providers/get/category/${category}`
      );
      if (response.status === 200) {
        setProviders(response.data);
      } else {
        setError("Failed to fetch providers.");
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
      setError("Something went wrong while fetching providers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      fetchProviders(category);
    }
  }, [category]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <button
          className="text-blue-600 hover:underline mb-2"
          onClick={() => window.history.back()}
        >
          ← Back to services
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Provider
        </h2>
        <p className="text-gray-600">Select a provider for your service</p>
      </div>

      {/* Loader */}
      {loading && (
        <div className="text-center text-blue-600 font-medium">
          Loading providers...
        </div>
      )}

      {/* Error message */}
      {error && !loading && (
        <div className="text-center text-red-600 font-medium">{error}</div>
      )}

      {/* No providers */}
      {!loading && !error && providers.length === 0 && (
        <div className="text-center text-gray-500">
          No providers available for this service.
        </div>
      )}

      <div className="space-y-4">
        {providers.map((provider) => (
          <Link key={provider._id} to={`/slots/${provider._id}`} className="block">
            <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
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
