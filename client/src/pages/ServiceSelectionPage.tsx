import { Link } from "react-router-dom";
const serviceTypes =[
        { value: "plumbing", label: "Plumbing", icon: "🔧" },
        { value: "electrical", label: "Electrical", icon: "⚡" },
        { value: "cleaning", label: "Cleaning", icon: "🧽" },
        { value: "gardening", label: "Gardening", icon: "🌱" },
        { value: "painting", label: "Painting", icon: "🎨" },
        { value: "carpentry", label: "Carpentry", icon: "🔨" },
        { value: "welding", label: "Welding", icon: "🔥" },
        { value: "carwashing", label: "Car Washing", icon: "🚗" }
    ];


const ServiceSelectionPage = ({ }) => (
  <div className="max-w-md mx-auto space-y-6">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Service</h2>
      <p className="text-gray-600">What type of service do you need?</p>
    </div>

    <div className="grid grid-cols-2 gap-4">
      {serviceTypes.map((service) => (
        <Link
          to={`/providers/${service.value}`}
          key={service.value}
          className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
        >
          <div className="text-3xl mb-2">{service.icon}</div>
          <div className="font-medium text-gray-900">{service.label.replace(/^\S+\s/, '')}</div>
        </Link>
      ))}
    </div>
  </div>
);

export default ServiceSelectionPage;
