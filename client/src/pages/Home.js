import NavBar from "../features/navbar/Navbar";
import ProductList from "../features/product/components/ProductList";
import Footer from "../features/common/components/Footer";
import { resetUserError, selectLoggedInUser } from "../features/auth/authSlice";
import { selectUserInfo } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

function Home() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const userInfo = useSelector(selectUserInfo);

  const role = userInfo?.role || user?.role;

  useEffect(() => {
    dispatch(resetUserError());
  }, [dispatch]);

  if (role === "admin") {
    return <Navigate to="/admin" replace={true} />;
  }

  return (
    <>
      <NavBar>
        <ProductList></ProductList>
      </NavBar>
      <Footer></Footer>
    </>
  );
}

export default Home;