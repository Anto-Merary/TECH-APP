import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { saveUserData } from "@/lib/quizStorage";
import ritLogo from "../assets/rit-logo.jpeg";

const FrontPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    grade: "",
    school_name: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Oops!",
        description: "Please enter your name",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.age || parseInt(formData.age) <= 0) {
      toast({
        title: "Oops!",
        description: "Please enter a valid age",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast({
        title: "Oops!",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Oops!",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = await saveUserData({
        name: formData.name.trim(),
        age: parseInt(formData.age),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender || null,
        grade: formData.grade.trim() || null,
        school_name: formData.school_name.trim() || null,
      });

      if (!userId) {
        throw new Error("Failed to save user data");
      }

      // Store user ID and data in localStorage for later use
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", formData.name.trim());
      localStorage.setItem("userEmail", formData.email.trim());
      localStorage.setItem("userPhone", formData.phone.trim());
      localStorage.setItem("userAge", formData.age);
      localStorage.setItem("userGender", formData.gender || "");
      localStorage.setItem("userGrade", formData.grade.trim() || "");
      localStorage.setItem("userSchoolName", formData.school_name.trim() || "");

      toast({
        title: "🎉 Awesome!",
        description: "Let's begin your journey!",
      });

      // Navigate to home page after successful save
      navigate("/home");
    } catch (error) {
      console.error("Error saving user data:", error);
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again!",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-orange-500 mb-4 text-center">
          Let's Get to Know You! 
        </h3>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your awesome name "
            className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
            required
            disabled={isSubmitting}
          />

          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            placeholder="Enter your age "
            min="1"
            className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
            required
            disabled={isSubmitting}
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-600"
            disabled={isSubmitting}
          >
            <option value="">Select your gender </option>
            <option value="boy">Boy</option>
            <option value="girl">Girl</option>
            <option value="other">Other</option>
          </select>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
            required
            disabled={isSubmitting}
          />

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number "
            className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
            required
            disabled={isSubmitting}
          />

          <input
            type="text"
            name="grade"
            value={formData.grade}
            onChange={handleInputChange}
            placeholder="Enter your grade (e.g., 5th, 6th, etc.)"
            className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
            disabled={isSubmitting}
          />

          <input
            type="text"
            name="school_name"
            value={formData.school_name}
            onChange={handleInputChange}
            placeholder="Enter your school name"
            className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
            disabled={isSubmitting}
          />
        </div>

        {/* Start Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-2 rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? "Saving..." : "Let's Begin"}
        </button>
      </form>
    </div>
  );
};

export default FrontPage;