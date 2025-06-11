const Footer = () => {
  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          textAlign: "center",
          paddingTop: "1rem",
          zIndex: 1000,
        }}
      >
        <footer
          className="text-center py-3"
          style={{ backgroundColor: "#343a40", color: "#fff" }}
        >
          <p className="mb-0">
            {" "}
            &copy; {new Date().getFullYear()} SupaNext. All Rights Reserved
          </p>
        </footer>
      </div>
    </>
  );
};

export default Footer;
