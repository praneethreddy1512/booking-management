import { CheckCircle } from 'lucide-react';



const BookingSuccessPage= () => (
  <div className="max-w-md mx-auto text-center space-y-6">
    <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
    <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
    <p className="text-gray-600">We’ve sent you a confirmation email with the details of your booking.</p>
    <button
      // onClick={onBookAnother}
      className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
    >
      Book Another Service
    </button>
  </div>
);

export default BookingSuccessPage;
