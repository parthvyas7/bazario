import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

function App() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "buyer",
  });
  const [userData, setUserData] = useState({});
  const handleFormInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleRegister = (e) => {
    e.preventDefault();
    fetch("https://reqres.in/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.token) {
          setUserData({
            ...userData,
            data: {
              id: res.id,
            },
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    if (userData.data) {
      fetch(`https://reqres.in/api/users/${userData.data.id}`)
        .then((res) => res.json())
        .then((res) => setUserData(res));
    }
  }, [userData.data]);

  return (
    <>
      <nav>
      <h1 className="text-3xl">Bazario</h1>
      <form onSubmit={handleRegister}>
        <input
          className="border"
          type="email"
          name="email"
          placeholder="email"
          value={formData.email}
          onChange={handleFormInput}
        />
        <input
          className="border"
          type="password"
          name="password"
          placeholder="password"
          value={formData.password}
          onChange={handleFormInput}
        />
        <button type="submit" className="bg-slate-300 p-2 rounded">
          Register
        </button>
      </form>
      <Link to="/viewcart">View Cart</Link>
      {userData.data && (
        <>
          <p>Welcome!{userData.data.first_name}</p>
        </>
      )}
      </nav>
      <Link to='/productlisting'>Product Listing</Link>
      <Link to='/orders'>View Orders</Link>
      <Outlet />
    </>
  );
}

export default App;
