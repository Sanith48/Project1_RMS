import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import "./Checkout.css";
import image from "./../images/food.webp";

export default function Checkout() {
  const [data, setData] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0); // To handle the discount

  const getData = () => {
    const url = "http://localhost:5000/api/cart";
    const params = {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(url, params)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleApplyCoupon = () => {
    // For simplicity, assume a dummy coupon code "DISCOUNT10" gives 10% off
    if (couponCode === "DISCOUNT10") {
      setDiscount(0.1); // 10% discount
      alert("Coupon applied! You got 10% off.");
    } else {
      setDiscount(0); // No discount if invalid code
      alert("Invalid coupon code");
    }
  };

  const calculateTotal = () => {
    const total = data.reduce((sum, item) => sum + item.food_price * item.quantity, 0);
    return total - total * discount;
  };

  return (
    <div style={{ height: "100%", backgroundImage: `url(${image})`, backgroundSize: "cover", fontFamily: '"Merriweather", serif' }}>
      <div className="checkout-container">
        <h1 className="h1">
          <div>Your Food Cart</div>
        </h1>
        <Link className="btn btn-light mx-1" to="/Home" role="button">
          Back
        </Link>
        <h3 className="h3">
          <i>Checkout your favourite food Added: </i>
        </h3>
        <div className="cart-container">
          {data.map((f) => (
            <div className="fooditem" key={f.food_id}>
              <div className="foodname">{f.food_name}</div>
              <div>{f.food_price}</div>
              <div>{f.quantity}</div>
              <div>{f.food_price * f.quantity}</div>
            </div>
          ))}

          <div className="coupon">
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Have a coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)} // Set the coupon code
                aria-label=""
                aria-describedby="basic-addon2"
              />
              <Button variant="outline-primary" id="button-addon2" onClick={handleApplyCoupon}>
                Apply
              </Button>
            </InputGroup>
          </div>

          <div className="total">
            <h4>Total: ${calculateTotal().toFixed(2)}</h4>
          </div>
        </div>
      </div>

      {/* Payment button positioned at the bottom using flexbox */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', paddingBottom: '20px' }}>
        <Link className="btn btn-primary" to="/Payment">
          Payment
        </Link>
      </div>
    </div>
  );
}
