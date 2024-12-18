"use client";

import axios, { Axios } from "axios";
import VisitorCount from "./component/VisitorCount";

import Image from "next/image";

import { useState, useEffect } from "react";

import {
  collection,
  addDoc,
  query,
  onSnapshot,
  querySnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export default function Home() {
  const [items, setItems] = useState([
    // { name: "Coffee", price: 4.95 },
    // { name: "movie", price: 24.95 },
    // { name: "candy", price: 7.95 },
  ]);

  const [newItem, setNewItem] = useState({ name: "", price: "" });

  const [total, setTotal] = useState(0);

  //add item to database

  const addItem = async (e) => {
    e.preventDefault();
    if (newItem !== " " && newItem.price !== "") {
      // setItems([...items, newItem]);
      await addDoc(collection(db, `items`), {
        name: newItem.name.trim(),
        price: newItem.price,
      });
      setNewItem({ name: "", price: "" });
    }
  };

  //read item from database

  useEffect(() => {
    const q = query(collection(db, `items`));
    const unsubscibe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });

      setItems(itemsArr);

      // read total from itemsArr

      const calculateTotal = () => {
        const totalPrice = itemsArr.reduce(
          (sum, item) => sum + parseFloat(item.price),
          0
        );
        setTotal(totalPrice);
      };
      calculateTotal();
      return () => unsubscibe();
    });
  }, []);

  //deleted item from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, `items`, id));
  };

  //counting visitors

  const trackVisitor = async () => {
    try {
      const response = await axios.post("/api/trackVisitor");
      console.log("Visitor tracked:", response.data);
    } catch (error) {
      console.error("Error tracking visitor:", error);
    }
  };

  useEffect(() => {
    trackVisitor();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <h1 className="text-4xl p-4 text-center">Expense Tracker</h1>
        </div>{" "}
        <div className="bg-slate-800 p-4 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black ">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-2 border p-3"
              type="text"
              placeholder="Enter Item"
            />
            <input
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className="col-span-2 border p-3 mx-3"
              type="number"
              placeholder="Enter number"
            />
            <button
              onClick={addItem}
              className="text-white bg-slate-950 hover:bg-slate-300 p-3 text-xl"
              type="submit"
            >
              +
            </button>
          </form>
          <ul>
            {items.map((item, id) => (
              <li
                key={id}
                className="my-4 w-full flex justify-between bg-slate-950"
              >
                <div className="p-4 w-full flex justify-between">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? (
            ""
          ) : (
            <div className="flex justify-between p-3">
              <span>Total</span>
              <span>{total}</span>
            </div>
          )}
        </div>
        <VisitorCount />
      </main>
    </div>
  );
}
