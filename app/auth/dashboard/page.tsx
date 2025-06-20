"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/SupabaseClient";
import { useMyAppHook } from "@/context/AppUtils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";

interface ProductType {
  id?: number;
  title: string;
  content: string;
  cost: string;
  banner_image?: string | File | null;
}



const formSchema = yup.object().shape({
  title: yup.string().required("Product title is required"),
  content: yup.string().required("Description is required"),
  cost: yup.string().required("Product cost is required"),
});

export default function Dashboard() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);


  const {
    setAuthToken,
    setIsLoggedIn,
    isLoggedIn,
    setUserProfile,
    setIsLoading,
  } = useMyAppHook();
  
  const router = useRouter();

  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: yupResolver(formSchema),
  });

  //Fetch Products
  //user is logged in , after login we will fetch the userid , pass the userid to function that function will fetch the product from the table

  const fetchProductsFromTable = async (userId: string) => {
    setIsLoading(true);

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", userId);

      if (data) {
        setProducts(data as ProductType[]);
      } else {
        setProducts([]);
      }

    setIsLoading(false);
  };

  useEffect(() => {
    const handleLoginSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        toast.error("Failed to get user data");
        router.push("/auth/login");
        return;
      }

      setIsLoading(true);
      if (data.session?.access_token) {
        setAuthToken(data.session?.access_token);
        setUserId(data.session?.user.id);
        localStorage.setItem("access_token", data.session?.access_token);
        setIsLoggedIn(true);
        setUserProfile({
          name: data.session.user?.user_metadata.displayName || data.session.user?.user_metadata.name,
          email: data.session.user?.user_metadata.email,
          gender: data.session.user?.user_metadata.gender,
          phone: data.session.user?.user_metadata.phone,
          profile_picture: data.session.user?.user_metadata.profile_picture,
          id: data.session?.user.id,
        });

        //toast.success("User logged in successfully");

        localStorage.setItem(
          "user_profile",
          JSON.stringify({
            name: data.session.user?.user_metadata.displayName || data.session.user?.user_metadata.name,
            email: data.session.user?.user_metadata.email,
            gender: data.session.user?.user_metadata.gender,
            phone: data.session.user?.user_metadata.phone,
            profile_picture: data.session.user?.user_metadata.profile_picture,
            id: data.session?.user.id,
          })
        );

        fetchProductsFromTable(data.session.user.id);
      }
      setIsLoading(false);
    };

    handleLoginSession();

    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
  }, []);

  // Upload Banner Image
  const uploadImageFile = async (file: File) => {
    // banner.jpg

    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) {
      toast.error("Failed to upload banner image");
      return null;
    }

    return supabase.storage.from("product-images").getPublicUrl(fileName).data
      .publicUrl;
  };

  // Form Submit
  const onFormSubmit = async (formData: ProductType) => {
    setIsLoading(true);

    let imagePath = formData.banner_image;

    if (formData.banner_image instanceof File) {
      imagePath = await uploadImageFile(formData.banner_image);
      if (!imagePath) return;
    }

    if (editId) {
      // Edit Operation
      const { error } = await supabase
        .from("products")
        .update({
          ...formData,
          banner_image: imagePath,
        })
        .match({
          id: editId,
          user_id: userId,
        });

      if (error) {
        toast.error("Failed to update product data");
      } else {
        toast.success("Product has been updated successfully");
      }
    } else {

      // Add Operation
      const { error } = await supabase.from("products").insert({
        ...formData,
        user_id: userId,
        banner_image: imagePath,
      });

      if (error) {
        toast.error("Failed to Add Product");
      } else {
        toast.success("Successfully Product has been created!");
      }
      reset();
    }

    setPreviewImage(null);
    fetchProductsFromTable(userId!);
    setIsLoading(false);
  };

  

  // Edit Data
  const handleEditData = (product: ProductType) => {
    // console.log(product);
    setValue("title", product.title);
    setValue("content", product.content ?? "");
    setValue("cost", product.cost ?? "");
    setPreviewImage(typeof product.banner_image === "string" ? product.banner_image : null);
    setEditId(product.id!);
  };

  // Delete Product Operation
  const handleDeleteProduct = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase.from("products").delete().match({
          id: id,
          user_id: userId,
        });

        if (error) {
          toast.error("Failed to delete product");
        } else {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          fetchProductsFromTable(userId!);
        }
      }
    });
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <div className="row">

          <div className="col-md-5">
            <h3>{editId ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("title")}
                />
                <small className="text-danger">{errors.title?.message}</small>
              </div>
              <div className="mb-3">
                <label className="form-label">Content</label>
                <textarea
                  className="form-control"
                  {...register("content")}
                ></textarea>
                <small className="text-danger">{errors.content?.message}</small>
              </div>
              <div className="mb-3">
                <label className="form-label">Cost</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("cost")}
                />
                <small className="text-danger">{errors.cost?.message}</small>
              </div>
              <div className="mb-3">
                <label className="form-label">Banner Image</label>
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
                      setValue("banner_image", event.target.files[0]); // Set the file in the form state
                    }
                  }}
                />
                <small className="text-danger"></small>
              </div>

              <button type="submit" className="btn btn-success w-100">
                {editId ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>

          {/*--------- Product List -------------------*/}
          <div className="col-md-7">
            <h3>Product List</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Cost</th>
                  <th>Banner Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products ? (
                  products.map((singleProduct, index) => (
                    <tr key={index}>
                      <td>{singleProduct.title}</td>
                      <td>{singleProduct.content}</td>
                      <td>${singleProduct.cost}</td>
                      <td>
                        {singleProduct.banner_image ? (
                          <Image
                          src={
                            singleProduct.banner_image as string}
                            alt="Sample Product"
                            width="40"
                            height="40"
                          />
                        ) : (
                          "--"
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEditData(singleProduct)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          style={{
                            marginLeft: "10px",
                          }}
                          onClick={() => handleDeleteProduct(singleProduct.id!)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}