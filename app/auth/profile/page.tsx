"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useMyAppHook } from "@/context/AppUtils";
import Image from "next/image";

export default function ProfilePage() {
  const { userProfile } = useMyAppHook();

  return (
    <>
      <Navbar />
      {userProfile ? (
        <div className="container mt-5">

          <div className="d-flex"  style={{ gap: '20px' }}>
            <h2 className="mb-3">Profile</h2>
            <div>
              <Link
              className="btn btn-primary btn-sm mt-2"
              href="/auth/editProfile"
            >
              Edit
            </Link>
            </div>

          </div>

          <div className=" d-flex flex-row justify-content-between align-items-center card p-4 shadow-sm col-sm-6" >
            <div>
              <p>
              <strong>Name: </strong>
              {userProfile?.name}
            </p>
            <p>
              <strong>Email: </strong>
              {userProfile?.email}
            </p>
            <p>
              <strong>Phone: </strong>
              {userProfile?.phone}
            </p>
            <p>
              <strong>Gender: </strong>
              {userProfile?.gender}
            </p>
            </div>

            <div>
              {/* Profile Photo */}
            <p>
              {typeof userProfile?.profile_picture === "string" ? (
                <Image
                  src={userProfile.profile_picture}
                  alt="Profile Picture"
                  width="160"
                  height="160"
                  style={{ objectFit: "fill", borderRadius: "10%" }}
                />
              ) : userProfile?.profile_picture instanceof File ? (
                <span>[Image file uploaded]</span>
              ) : (
                <span>No picture</span>
              )}
            </p>
            </div>
          </div>

        </div>
      ) : (
        <p>No Profile Found</p>
      )}

      <Footer />
    </>
  );
}
