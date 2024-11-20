import { useParams } from "react-router-dom";
import "../styles/List.scss";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/state";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const { search } = useParams(); // Get search term from the URL
  const listings = useSelector((state) => state.listings); // Access listings from Redux store
  const dispatch = useDispatch();

  const getSearchListings = async () => {
    try {
      const response = await fetch(`http://localhost:3001/properties/search/${search}`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setListings({ listings: data }));
      } else {
        throw new Error("Failed to fetch search listings");
      }
    } catch (err) {
      console.error("Fetch Search List failed!", err.message);
      // Optionally, set an error state to show a message on UI
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  useEffect(() => {
    getSearchListings();
  }, [search]); // Refetch the search results when search changes

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{`Search results for "${search}"`}</h1>
      <div className="list">
        {listings?.length > 0 ? (
          listings.map(
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
              booking = false, // default value for booking
            }) => (
              <ListingCard
                key={_id} // Always provide a unique key for each component in a list
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
          )
        ) : (
          <p>No results found</p> // Display message when no listings are found
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
