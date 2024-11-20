import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setReservationList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const ReservationList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const reservationList = useSelector((state) => state.user.reservationList);

  const dispatch = useDispatch();

  const getReservationList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/reservations`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch(setReservationList(data));
    } catch (err) {
      console.log("Fetch Reservation List failed!", err.message);
    } finally {
      setLoading(false); // Set loading to false after the fetch attempt, regardless of success or failure
    }
  };

  useEffect(() => {
    getReservationList();
  }, [userId]); // Add userId as a dependency to refetch when the userId changes

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your Reservation List</h1>
      <div className="list">
        {reservationList?.map(
          ({
            listingId,
            hostId,
            startDate,
            endDate,
            totalPrice,
            booking = true, // default value
          }) => (
            <ListingCard
              key={listingId._id} // Added a key for better performance and to avoid warning
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
      <Footer />
    </>
  );
};

export default ReservationList;
