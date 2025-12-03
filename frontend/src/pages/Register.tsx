import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { register as registerUser } from "../services/auth/auth.api";
import type { AuthRegisterRequest } from "../types/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ import icons

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle password visibility

  // Validation schema
  const schema = Yup.object({
    name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    role: Yup.number()
      .oneOf([2, 3], "Invalid role")
      .required("Role is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthRegisterRequest>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "", password: "", role: 3 },
  });

  const onSubmit = async (data: AuthRegisterRequest) => {
    try {
      await registerUser(data);
      alert("Registration successful!");
      navigate("/login");
    } catch (err: any) {
      alert(
        err.response?.data?.message || err.message || "Registration failed"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="mb-4">
            <input
              {...register("name")}
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <input
              {...register("email")}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password with Eye Icon 👁️ */}
          <div className="mb-4 relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password must be at least 8 characters"
              className="w-full px-4 py-2 border rounded pr-10"
            />
            {/* 👁️ Eye icon button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="mb-6">
            <select
              {...register("role")}
              className="w-full px-4 py-2 border rounded"
            >
              <option value={2}>Instructor</option>
              <option value={3}>Learner</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
