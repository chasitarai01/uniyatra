import React, { useEffect, useState } from "react";
import axios from "axios";

const FavoriteUniversities = () => {

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {

    const fetchFavorites = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5001/api/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFavorites(res.data.data);

      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();

  }, []);

  return (
    <div>
      <h2>Your Favorite Universities</h2>

      {favorites.map((fav) => (
        <div key={fav._id} style={{border:"1px solid #ddd", margin:"10px", padding:"10px"}}>

          <img
            src={fav.universityId.Logo}
            alt={fav.universityId.University}
            width="100"
          />

          <h3>{fav.universityId.University}</h3>

          <p>{fav.universityId.City}</p>

          <p>Country: {fav.universityId.Country}</p>

          <p>QS Rank: {fav.universityId.QSWorldRank}</p>

        </div>
      ))}

    </div>
  );
};

export default FavoriteUniversities;