"use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";



export default function Home() {
  const router = useRouter();

  function handleLogin() {
    router.push("/auth/login");
  }
  return (
    <>
    <Navbar />
       <header className="container text-center py-5">
        <header className="mb-5"></header>
        <h1 className="display-4 fw-bold">👋🏻 Welcome to SupaNext</h1>
        <p className="Lead">A Next.js application with supabase integration</p>
        <button className="btn btn-primary btn-lg" onClick={handleLogin}>Get Started</button>
       </header>
       
       <section className="row g-4">
        {/* card component */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Fast & Secure</h5>
              <p className="card-text">
              🤩 Built with Next.js and Supabase, ensuring high performace and security.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Authentication</h5>
              <p className="card-text">
              🔑 Secure user authentication with Supabase, including email and password login.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Data & Storage</h5>
              <p className="card-text">
              👩🏻‍💻 Manage your data and files effortlessly with Supabase powerful database and storage solutions.
              </p>
            </div>
          </div>
        </div>
       </section>
       <Footer />
    </>
    
  );
}
