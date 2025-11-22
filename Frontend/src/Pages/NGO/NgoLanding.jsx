import { useEffect } from "react";
import { fetchNgoProfile } from "../../Slices/NgoSlice";
import { useDispatch, useSelector } from "react-redux";
export default function NgoLanding() {
  const dispatch = useDispatch();
  const { data, loading, errors } = useSelector((state) => {
    return state.ngo;
  });
  useEffect(() => {
    dispatch(fetchNgoProfile());
  }, []);
  return (
    <div>
      <h1>Ngo Landing</h1>
      <h1>{data.ngoName}</h1>
    </div>
  );
}
