import { useNavigate } from "react-router-dom";
import ritLogo from "../assets/rit-logo.jpeg";

const FrontPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF6E5] flex flex-col items-center justify-center px-4">
      
      {/* Logo */}
      <img
        src={ritLogo}
        alt="RIT Logo"
        className="w-32 mb-4"
      />

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-1">
        RIT AstroMind
      </h1>

      {/* Subtitle */}
      <h2 className="text-lg md:text-xl text-orange-400 font-semibold mb-3">
        Discover Your Future! 🚀
      </h2>

      {/* Description */}
      <p className="text-center text-gray-600 mb-6 max-w-md">
        Answer a few fun questions and let us guess the career that suits you best! 🌟  
        <br />
        <span className="text-sm">No stress. Just fun. Just you 😄</span>
      </p>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-orange-500 mb-4 text-center">
          Let’s Get to Know You! 
        </h3>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your awesome name "
            className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          <input
            type="number"
            placeholder="Enter your age "
            className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          <select
            className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-600"
          >
            <option value="">Select your gender </option>
            <option value="boy">Boy</option>
            <option value="girl">Girl</option>
            <option value="other">Other</option>
          </select>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          <input
            type="tel"
            placeholder="Enter your phone number "
            className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        {/* Start Button */}
        <button
          onClick={() => navigate("/home")}
          className="mt-6 w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-2 rounded-xl font-semibold hover:scale-105 transition-transform"
        >
          Let’s Begin
        </button>
      </div>
    </div>
  );
};

export default FrontPage;