import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

function App() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "buyer",
  });
  const [userData, setUserData] = useState({});
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.escuelajs.co/api/v1/products?offset=0&limit=10"
      );
      return await response.json();
    },
  });
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
  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
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
      {userData.data && (
        <>
          <p>Welcome!{userData.data.first_name}</p>
        </>
      )}
      <div>{isFetching && "Updating..."}</div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {data.map((product) => {
          return (
            <>
              <div>
                <p key={product.id} className="m-2">
                  {product.title}
                </p>
                <button className="bg-slate-300 p-2 m-2 rounded shadow hover:bg-slate-50">
                  Add to Cart
                </button>
                <button className="bg-slate-300 p-2 m-2 rounded shadow hover:bg-slate-50">
                  Buy Now
                </button>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}

export default App;
