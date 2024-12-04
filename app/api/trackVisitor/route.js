import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  increment,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase"; // Adjust the relative path as necessary
import axios from "axios";

const fetchIPAddress = async () => {
  const res = await axios.get("https://api.ipify.org?format=json");
  return res.data.ip;
};

export async function POST(req) {
  try {
    const ip = await fetchIPAddress();

    // Check if visitor already exists
    const visitorsRef = collection(db, "visitors");
    const q = query(visitorsRef, where("ip", "==", ip));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Add new visitor
      await addDoc(visitorsRef, { ip, timestamp: new Date() });

      // Check if stats/visitorCount exists
      const statsRef = doc(db, "stats", "visitorCount");
      const statsSnapshot = await getDocs(statsRef);

      if (querySnapshot.empty) {
        // Add new visitor to visitors collection
        await addDoc(visitorsRef, { ip, timestamp: new Date() });

        // Check if visitorCount document exists
        const statsRef = doc(db, "stats", "visitorCount");
        const docSnap = await getDoc(statsRef);

        if (!docSnap.exists()) {
          // Create the document with count: 0 if it doesn't exist
          await setDoc(statsRef, { count: 0 });
        }
      }

      // Increment the visitor count
      await updateDoc(statsRef, { count: increment(1) });

      // Send a successful response
      return res.status(200).json({ message: "Visitor tracked successfully" });
    } else {
      return res.status(200).json({ message: "Visitor already tracked" });
    }
  } catch (error) {
    console.error("Error in trackVisitor route:", error);
    return res
      .status(500)
      .json({ message: "Error tracking visitor", error: error.message });
  }
}
