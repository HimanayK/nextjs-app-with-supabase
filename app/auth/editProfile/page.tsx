"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// yup -> form validation
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { supabase } from "@/lib/SupabaseClient";
import toast from "react-hot-toast";
// custom Hook
import { useMyAppHook } from "@/context/AppUtils";

// Import Image
import Image from "next/image";
import { useEffect, useState } from "react";

// Import SweetAlert2
// import Swal from "sweetalert2";


interface EditProfileType {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  profile_picture?: string | File | null;
}

//Form Validation
const formSchema = yup.object().shape({
  name: yup.string(),
  email: yup.string().email("Invalid email"),
  phone: yup.string(),
  gender: yup.string().oneOf(["Male", "Female", "Other"]),
  profile_picture: yup.mixed(),
});

export default function EditProfilePage() {
  // previewImage useState hook
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Custom hook to use Profile of loggedin user
  const { userProfile, setUserProfile } = useMyAppHook();

    // Show previous profile picture on mount
  useEffect(() => {
    if (userProfile?.profile_picture) {
      if (typeof userProfile.profile_picture === "string") {
        setPreviewImage(userProfile.profile_picture);
      } else if (userProfile.profile_picture instanceof File) {
        setPreviewImage(URL.createObjectURL(userProfile.profile_picture));
      }
    }
  }, [userProfile?.profile_picture]);

  // yupResolver
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  // Upload Profile Picture
  const uploadImageFile = async (file: File) => {
    // profile.jpg
    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;

    const { error } = await supabase.storage
      .from("profile-pictures")
      .upload(fileName, file);

    if (error) {
      toast.error("Failed to upload profile picture");
      return null;
    }

    return supabase.storage.from("profile-pictures").getPublicUrl(fileName).data
      .publicUrl;
  };

  console.log("--userProfile-- :", userProfile);

  // onsubmit Function:
  // Update Logged In user info
  const onsubmit = async (formData: EditProfileType) => {
    let imagePath = null;

    if (formData.profile_picture instanceof File) {
      imagePath = await uploadImageFile(formData.profile_picture);
      if (!imagePath) return;
    }
    // Update User Info
    const payload = {
      ...(formData?.name && { displayName: formData.name }),
      ...(formData?.email && { email: formData.email }),
      ...(formData?.phone && { phone: formData.phone }),
      ...(formData?.gender && { gender: formData.gender }),
      ...(formData?.profile_picture && {
        profile_picture: imagePath,
      }),
    };

    const { data, error } = await supabase.auth.updateUser({
      data: payload,
    });

    console.log("----DATA of User ----: ", data);

    if (data) {
      setUserProfile({
        id: data.user?.id,
        name: data.user?.user_metadata.displayName,
        email: data.user?.user_metadata.email,
        gender: data.user?.user_metadata.gender,
        phone: data.user?.user_metadata.phone,
        profile_picture: data.user?.user_metadata.profile_picture,
      });

      localStorage.setItem(
        "user_profile",
        JSON.stringify({
          id: data.user?.id, 
          name: data.user?.user_metadata.displayName,
          email: data.user?.user_metadata.email,
          gender: data.user?.user_metadata.gender,
          phone: data.user?.user_metadata.phone,
          profile_picture: data.user?.user_metadata.profile_picture,
        })
      );
    }

    console.log("New ----DATA of User ----: ", data);

    if (error) {
      toast.error("Failed to update profile.");
    } else {
      toast.success("Profile updated successfully");
    }
  };

  // Delete userProfile ----------------------------------------------------------------
// const handleDeleteProfile = async () => {
//   const result = await Swal.fire({
//     title: "Are you sure?",
//     text: "This action will delete your profile permanently!",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#d33",
//     cancelButtonColor: "#3085d6",
//     confirmButtonText: "Yes, delete it!",
//   });

//   if (result.isConfirmed) {
//     try {
//       const user_id = userProfile?.id;
//       const response = await fetch("/api/delete-user", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ user_id }),
//       });
//       if (!response.ok) throw new Error("Failed to delete profile.");
//       localStorage.removeItem("user_profile");
//       setUserProfile(null);
//       toast.success("Profile deleted successfully");
//       window.location.href = "/";
//     } catch {
//       toast.error("Failed to delete profile.");
//     }
//   }
// };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center mb-3">Edit Profile</h2>

      <div style={{ maxHeight: '30rem', overflowY: 'auto' }}>
        <form onSubmit={handleSubmit(onsubmit)} className="w-50 mx-auto mt-3">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              {...register("name")}
              placeholder={userProfile?.name}
            />
            <p className="text-danger">{errors.name?.message}</p>
          </div>

            {/* EMAIL INPUT */}
          {/* <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              {...register("email")}
              placeholder={userProfile?.email}
            />
            <p className="text-danger">{errors.email?.message}</p>
          </div> */}

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              {...register("phone")}
              placeholder={userProfile?.phone}
            />
            <p className="text-danger">{errors.phone?.message}</p>
          </div>

          <div className="mb-3">
            <label className="form-label">Gender</label>
            <select className="form-control" {...register("gender")}>
              <option value="">--Select Gender--</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <p className="text-danger">{errors.gender?.message}</p>
          </div>

          <div className="mb-3">
            <label className="form-label">Profile Picture</label>
            <div className="mb-2">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Preview"
                  id="bannerPreview"
                  width="100"
                  height="100"
                />
              ) : (
                ""
              )}
            </div>

            <input
              type="file"
              className="form-control"
              onChange={(event) => {
                if (event.target.files && event.target.files.length > 0) {
                  setPreviewImage(URL.createObjectURL(event.target.files[0])); // Set the preview image
                  setValue("profile_picture", event.target.files[0]); // Set the file in the form state
                }
              }}
            />
            <small className="text-danger"></small>
          </div>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary btn-sm">
              Update
            </button>

            {/* <button
              className="btn btn-danger btn-sm"
              style={{ marginLeft: "10px" }}
              // onClick={handleDeleteProfile}
            >
              Delete
            </button> */}
          </div>
        </form>
        </div>

      </div>

      <Footer />
    </>
  );
}
