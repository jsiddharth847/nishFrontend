import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added for error handling
  const userId = useSelector((state) => state.user._id);
  const tripList = useSelector((state) => state.user.tripList);

  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/trips`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch trip list");
      }

      const data = await response.json();
      dispatch(setTripList(data));
    } catch (err) {
      setError(err.message); // Set error message
    } finally {
      setLoading(false); // Ensure loading state is set to false in all cases
    }
  };

  useEffect(() => {
    getTripList();
  }, [userId]); // Added userId as a dependency for useEffect to handle changes in user

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p> // Display error if there's an issue
      ) : tripList?.length === 0 ? (
        <p>No trips found.</p> // Message if no trips
      ) : (
        <div className="list">
          {tripList.map(
            ({ listingId, hostId, startDate, endDate, totalPrice, booking = true }) => (
              <ListingCard
                key={listingId._id} // Ensure each ListingCard has a unique key
                listingId={listingId._id}
                creator={hostId._id}
                listingPhotoPaths={listingId.listingPhotoPaths}
                city={listingId.city}
                province={listingId.province}
                country={listingId.country}
                category={listingId.category}
                startDate={startDate}
                endDate={endDate}
                totalPrice={totalPrice}
                booking={booking}
              />
            )
          )}
        </div>
      )}
      <Footer />
    </>
  );
};

export default TripList;
