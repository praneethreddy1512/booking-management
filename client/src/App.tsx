import ServiceSelectionPage from './pages/ServiceSelectionPage';
import ProviderSelectionPage from './pages/ProviderSelectionPage';
import UserInformationPage from './pages/UserInformationPage';
import ReviewBookingPage from './pages/ReviewBookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddProvider from './pages/AddProvider';
import { Toaster } from 'react-hot-toast';
import SlotSelectionPage from './pages/SlotSelectionPage';

const App: React.FC = () => {


  return (
    <>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/add-provider" element={<AddProvider />} />
        <Route path="/" element={<ServiceSelectionPage />} />
        <Route path="/providers/:category" element={<ProviderSelectionPage />} />
        <Route path="/slots/:providerId" element={<SlotSelectionPage />} />
        <Route path="/user-info" element={<UserInformationPage />} />
        <Route path="/review" element={<ReviewBookingPage />} />
        <Route path="/success" element={<BookingSuccessPage />} />
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default App;
