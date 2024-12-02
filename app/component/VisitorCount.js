import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function VisitorCount() {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const statsRef = doc(db, "stats", "visitorCount");
        const docSnap = await getDoc(statsRef);
        if (docSnap.exists()) {
          setVisitorCount(docSnap.data().count);
        }
      } catch (error) {
        // console.error("Error fetching visitor count:", error);
      }
    };

    fetchVisitorCount();
  }, []);

  return <div>Total Visitors: {visitorCount}</div>;
}
