"use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { supabase } from "@/lib/SupabaseClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const schema = yup.object().shape({
  displayName: yup.string().required("Display Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  gender: yup.string().required("Gender is required").oneOf(["Male", "Female", "Other"]),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password required"),
  confirmPassword: yup.string().required("Confirm Password is required").oneOf([yup.ref("password")], "Passwords must match"),
});

export default function RegisterPage() {
  const router = useRouter();
  const {
     register,
     handleSubmit,
     formState: {errors, isSubmitting },
} = useForm({
  resolver: yupResolver(schema),
});
const onsubmit = async (formdata: any) => {
  // console.log("Form submitted:", formdata);
  const {displayName, email, password, gender, phone } = formdata;
  const {data, error} = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName,
        gender,
        phone,
      },
    },
  });
  if (error) {
    toast.error("Failed to register the user")
  } else {
    toast.success("User registered successfully");
    //Optionally redirect to login or home page
    router.push("/auth/login");
  }
};
  return (
    <>
    <Navbar />
      <div className="container mt-5">
        <h2 className="text-center">Register</h2>
        <form onSubmit={handleSubmit(onsubmit)} className="w-50 mx-auto mt-3">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Display Name</label>
              <input type="text" className="form-control" {...register("displayName")} />
              <p className="text-danger">{errors.displayName?.message}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" {...register("email")} />
              <p className="text-danger">{errors.email?.message}</p>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label" >Phone</label>
              <input type="text" className="form-control" {...register("phone")} />
              <p className="text-danger">{errors.phone?.message}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label" >Gender</label>
              <select className="form-control" {...register("gender")}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <p className="text-danger">{errors.gender?.message}</p>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label" >Password</label>
              <input type="password" className="form-control" {...register("password")} />
              <p className="text-danger">{errors.password?.message}</p>
            </div>

            <div className="col-md-6">
              <label className="form-label" >Confirm Password</label>
              <input type="password" className="form-control" {...register("confirmPassword")} />
              <p className="text-danger">{errors.confirmPassword?.message}</p>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account? <a href="/auth/login">Login</a>
        </p>
      </div>
      <Footer />
    </>
  );
}
