// pages/api/trackVisitor.js
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  increment,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";

const fetchIPAddress = async () => {
  const res = await axios.get("https://api.ipify.org?format=json");
  return res.data.ip;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const ip = await fetchIPAddress();

    const visitorsRef = collection(db, "visitors");
    const q = query(visitorsRef, where("ip", "==", ip));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(visitorsRef, { ip, timestamp: new Date() });

      const statsRef = doc(db, "stats", "visitorCount");
      await updateDoc(statsRef, { count: increment(1) });
    }

    res.status(200).json({ message: "Visitor tracked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error tracking visitor", error });
  }
}
