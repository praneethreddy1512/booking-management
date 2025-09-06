import { useState } from "react";
import axios from "axios";
import toaster from "react-hot-toast"
type ProviderData = {
    name: string;
    email: string;
    phone: string;
    hourlyRate: number;
    service: string;
    workingHours: {
        start: string;
        end: string;
    };
};

const AddProvider = () => {
    const [data, setData] = useState<ProviderData>({
        name: "",
        email: "",
        phone: "",
        hourlyRate: 0,
        service: "",
        workingHours: {
            start: "",
            end: ""
        }
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  if (name.startsWith("workingHours.")) {
    const child = name.split(".")[1] as "start" | "end";
    setData((prevData) => ({
      ...prevData,
      workingHours: {
        ...prevData.workingHours,
        [child]: value,
      },
    }));
  } else {
    setData((prevData) => ({
      ...prevData,
      [name]: name === "hourlyRate" ? Number(value) : value, 
    }));
  }
};


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}providers/create`, data);
            if(response.status === 201){
                toaster.success("Provider added successfully!");
                setData({
                    name: "",
                    email: "",
                    phone: "",
                    hourlyRate: 0,
                    service: "",
                    workingHours: {
                        start: "",
                        end: ""
                    }
                });
            }

        } catch (error) {
            toaster.error(error instanceof Error ? error.message : "Error adding provider:");
        }
    };

    const services = [
        { value: "", label: "Select a service" },
        { value: "plumbing", label: "🔧 Plumbing" },
        { value: "electrical", label: "⚡ Electrical" },
        { value: "cleaning", label: "🧽 Cleaning" },
        { value: "gardening", label: "🌱 Gardening" },
        { value: "painting", label: "🎨 Painting" },
        { value: "carpentry", label: "🔨 Carpentry" },
        { value: "welding", label: "🔥 Welding" },
        { value: "carwashing", label: "🚗 Car Washing" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                   
                    <h1 className="text-5xl font-bold bg-clip-text  mb-2">
                        Add New Provider
                    </h1>
                    <p className="text-gray-600 text-lg">Join our network of trusted service providers</p>
                </div>

                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Personal Information</h3>
                            </div>

                            <div>
                                <label htmlFor="name" className="block font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl text-base bg-white shadow-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={data.email}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl text-base bg-white shadow-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={data.phone}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl text-base bg-white shadow-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                    placeholder="+91 1234567890"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">

                                <h3 className="text-2xl font-bold text-gray-800">Service Information</h3>
                            </div>

                            <div>
                                <label htmlFor="service" className="block font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">
                                    Service Type
                                </label>
                                <select
                                    id="service"
                                    name="service"
                                    value={data.service}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl text-base bg-white shadow-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                    required
                                >
                                    {services.map(service => (
                                        <option key={service.value} value={service.value}>
                                            {service.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Hourly Rate */}
                            <div>
                                <label htmlFor="hourlyRate" className="block font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">
                                    Hourly Rate 
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-lg">$</span>
                                    <input
                                        type="number"
                                        id="hourlyRate"
                                        name="hourlyRate"
                                        value={data.hourlyRate}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 pl-10 border-2 border-gray-200 rounded-2xl text-base bg-white shadow-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                        placeholder="25.00"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Working Hours */}
                            <div>
                                <label className="block font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">
                                    Working Hours
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="workingHours.start" className="text-sm font-medium text-gray-600 mb-2 block">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            id="workingHours.start"
                                            name="workingHours.start"
                                            value={data.workingHours.start}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl bg-white shadow-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="workingHours.end" className="text-sm font-medium text-gray-600 mb-2 block">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            id="workingHours.end"
                                            name="workingHours.end"
                                            value={data.workingHours.end}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl bg-white shadow-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <button type="submit" className="w-full px-8 py-5 text-white font-bold text-lg rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all bg-green-400 hover:bg-amber-500">
                                Add Provider
                            </button>
                        </div>
                    </form>
                </div>

                
            </div>
        </div>
    );
};

export default AddProvider;
