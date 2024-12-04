import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function VisitorCount() {
  const [visitorCount, setVisitorCount] = useState(null); // Use null to distinguish between "loading" and "0 visitors"

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const statsRef = doc(db, "stats", "visitorCount");
        const docSnap = await getDoc(statsRef);

        if (docSnap.exists()) {
          console.log("Document Data:", docSnap.data()); // Log raw document data
        } else {
          console.log("Document does not exist!");
        }

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Fetched visitor count:", data.count); // Debugging log
          setVisitorCount(data.count);
        } else {
          console.warn("Visitor count document does not exist!");
        }
      } catch (error) {
        console.error("Error fetching visitor count:", error);
      }
    };

    fetchVisitorCount();
  }, []);

  if (visitorCount === null) {
    return <div>Loading visitor count...</div>; // Indicate loading state
  }

  return <div>Total Visitors: {visitorCount}</div>;
}
