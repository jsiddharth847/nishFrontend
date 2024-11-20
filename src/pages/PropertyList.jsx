import "../styles/List.scss";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import { useEffect, useState } from "react";
import { setPropertyList } from "../redux/state";
import Loader from "../components/Loader";
import Footer from "../components/Footer";

const PropertyList = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const propertyList = user?.propertyList;

  const dispatch = useDispatch();

  // Ensure user is logged in and has a valid _id before making the request
  const getPropertyList = async () => {
    if (!user || !user._id) {
      console.log("User not logged in or user ID missing");
      return;
    }

    try {
      const response = await fetch(
        `https://nish-backend-git-main-siddharth-jains-projects-d140baae.vercel.app/users/${user._id}/properties`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      console.log(data);
      dispatch(setPropertyList(data)); // Dispatch data to redux store
      setLoading(false); // Stop loading after data is fetched
    } catch (err) {
      console.log("Fetch all properties failed", err.message);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getPropertyList(); // Fetch properties only if user._id is present
    }
  }, [user]); // Re-run when user data changes

  return loading ? (
    <Loader /> // Show Loader if data is still being fetched
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Property List</h1>
      <div className="list">
        {propertyList?.map(
          ({
            _id,
            creator,
            listingPhotoPaths,
            city,
            province,
            country,
            category,
            type,
            price,
            booking = false,
          }) => (
            <ListingCard
              key={_id} // Ensure each ListingCard has a unique key
              listingId={_id}
              creator={creator}
              listingPhotoPaths={listingPhotoPaths}
              city={city}
              province={province}
              country={country}
              category={category}
              type={type}
              price={price}
              booking={booking}
            />
          )
        )}
      </div>

      <Footer />
    </>
  );
};

export default PropertyList;
