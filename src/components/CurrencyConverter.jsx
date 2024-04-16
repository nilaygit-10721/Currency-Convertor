import React, { useEffect } from "react";
import { useState } from "react";
import { PiArrowsLeftRight } from "react-icons/pi";
import CurrencyDropdown from "./CurrencyDropdown";


const CurrencyConverter = () => {
  const [amount, setamount] = useState(1);
  const [currencies, setcurrencies] = useState([]);

  const [fromcurrency,setfromcurrency] = useState("USD");
  const [tocurrency, settocurrency] = useState("INR")

  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converting, setConverting] = useState(false);

  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || ["INR", "EUR"]
  );

  // Currencies -> https://api.frankfurter.app/currencies
  const fetchCurrencies = async () => {
    try {
      const res = await fetch("https://api.frankfurter.app/currencies");
      if (!res.ok) {
        throw new Error(`HTTP error: Status ${res.status}`);
      }
      const data = await res.json();
      setcurrencies(Object.keys(data));
     
    } catch (error) {
      console.log("error ");
    }
  };

  useEffect(()=>{
      fetchCurrencies();
  },[])

   // Conversion -> https://api.frankfurter.app/latest?amount=1&from=USD&to=INR
   const convertCurrency = async () => {
    if (!amount) return;
    setConverting(true);
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromcurrency}&to=${tocurrency}`
      );
      const data = await res.json();

      setConvertedAmount(data.rates[tocurrency] + " " + tocurrency);
      
    } catch (error) {
      console.error("Error Fetching", error);
    } finally {
      setConverting(false);
    }
  };

  const handlefavaorites = (currency) => {
    let updatedFavorites = [...favorites];

    if (favorites.includes(currency)) {
      updatedFavorites = updatedFavorites.filter((fav) => fav !== currency);
    } else {
      updatedFavorites.push(currency);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const swapcurrency= () =>{
    setfromcurrency(tocurrency);
    settocurrency(fromcurrency);
  }

  return (
    <div className="max-w-xl mx-auto my-10 p-5 bg-white rounded-lg shadow-md ">
      <h2 className="mb-5 text-2xl font-semibold text-gray-700">
        CurrencyConverter
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <CurrencyDropdown 
         favorites={favorites}
        currencies={currencies} 
        setcurrency={setfromcurrency}
        currency={fromcurrency}
        handlefavaorites={handlefavaorites}
        title="From:" />

      <div className="flex justify-center -mb-5 sm:mb-0">
        <button onClick={swapcurrency} className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300">
          <PiArrowsLeftRight className="text-xl text-gray-700"/>
        </button>
      </div>

        <CurrencyDropdown 
         favorites={favorites}
        currencies={currencies}
        setcurrency={settocurrency}
        currency={tocurrency}
        handlefavaorites={handlefavaorites}
         title="To:"/>
      </div>
      <div className="mt-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Amount
        </label>
        <input
          value={amount}
          onChange={(e) => setamount(e.target.value)}
          type="number"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
        />
      </div>

      <div className="flex justify-end mt-6">
        <button 
        onClick={convertCurrency}
        className={`px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${converting ? "animate-pulse" : ""}`}>
          Convert
        </button>
      </div>
{ convertedAmount &&(      <div className="mt-4 text-lg font-medium text-right text-green-600 ">
        Converted Amount: {convertedAmount}
      </div>)}
    </div>
  );
};

export default CurrencyConverter;
