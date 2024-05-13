import React, { useContext, useEffect } from "react";
import { Button } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import Error from "components/form/Error";
import LabelArea from "components/form/LabelArea";
import InputArea from "components/form/InputArea";
import ImageLight from "assets/img/login-office.jpeg";
import ImageDark from "assets/img/login-office-dark.jpeg";
import useLoginSubmit from "../hooks/useLoginSubmit";
import { AdminContext } from 'context/AdminContext';
import { useHistory, useLocation } from 'react-router-dom';
import { notifyError, notifySuccess } from "utils/toast";
import { Link } from "@react-pdf/renderer";
import { ImFacebook, ImGoogle } from "react-icons/im";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
import AdminServices from "services/AdminServices";

const Login = () => {
  const { t } = useTranslation();
  const { onSubmit, register, handleSubmit, errors, loading } =
    useLoginSubmit();

  const { dispatch } = useContext(AdminContext);
  const history = useHistory();
  const location = useLocation();
  const { googleLoginAdmin } = AdminServices;
  // Import the functions you need from the SDKs you need

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBGAVOqfuKYCJ8B3D42cI4JA7W-I0-rGr4",
    authDomain: "ecomdaddyy.firebaseapp.com",
    projectId: "ecomdaddyy",
    storageBucket: "ecomdaddyy.appspot.com",
    messagingSenderId: "932602306808",
    appId: "1:932602306808:web:463676993d7d5ab81bdb0d",
    measurementId: "G-YLF5X1P9RD"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result);
      const user = result.user;
      const tokenId = await user.getIdToken();
      console.log("Google sign-in successful:", user);
      console.log("Google sign-in successful:", user.email);
      console.log("Google sign-in successful:", user.accessToken);

      const res = await googleLoginAdmin({ tokenId });
      console.log("Google Response:", res);
      console.log("Google Resposnes:", res);
      if (res.accessToken) {
        notifySuccess('Logged in successfully');
        dispatch({
          type: 'USER_LOGIN',
          payload: {
            token: res.accessToken
          }
        });
        localStorage.setItem("email", user.email);
        history.replace('/');
      } else {
        notifyError('Failed to log in with Google');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      notifyError('Failed to sign in with Google');
    }
  };



  const handleFacebookSignIn = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Facebook sign-in successful:", user);
      notifySuccess('Logged in successfully');
      history.replace('/');
    } catch (error) {
      console.error('Facebook sign-in error:', error);
      notifyError('Failed to sign in with Facebook');
    }
  };

  // Added By : Govinda 

  // Explanation : before it was using synchronous userstatus() function which did not allowed sideffects and rendering properly now using useeffect allows decoupling of codes and allows sideeffects like rendering a differenct route when location.state has the specific route add your Logic accordingly if want changes in future

  useEffect(() => {
    const Email = localStorage.getItem("email");
    if (Email) {
      const { from } = location.state || { from: { pathname: "/" } };
      history.replace(from);
      notifySuccess('Welcome back!');
      dispatch({ type: 'USER_LOGIN', payload: { email: Email } });
    }
  }, [dispatch, history, location.state]);

  // const handleLogin = async (data) => {
  //   await onSubmit(data);
  //   const { from } = location.state || { from: { pathname: "/" } };
  //   history.replace(from);
  // };

  return (
    <>
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full dark:hidden"
                src={ImageLight}
                alt="Office"
              />
              <img
                aria-hidden="true"
                className="hidden object-cover w-full h-full dark:block"
                src={ImageDark}
                alt="Office"
              />
            </div>
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                  Login
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <LabelArea label="Email" />
                  <InputArea
                    register={register}
                    // defaultValue="admin@gmail.com"
                    defaultValue=""
                    label="Email"
                    name="email"
                    type="email"
                    // placeholder="john@doe.com"
                    placeholder="Enter Your Email....."
                  />
                  <Error errorName={errors.email} />
                  <div className="mt-6"></div>
                  <LabelArea label="Password" />
                  <InputArea
                    register={register}
                    // defaultValue="123456789"
                    defaultValue=""
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="***************"
                  />
                  <Error errorName={errors.password} />

                  <Button
                    disabled={loading}
                    type="submit"
                    className="mt-4 h-12 w-full"
                    to="/dashboard"
                  >
                    {t("LoginTitle")}
                  </Button>
                  <hr className="my-10" />
                  <button
                    className="text-sm inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center rounded-md focus:outline-none text-gray-700 bg-gray-100 shadow-sm my-2  md:px-2 lg:px-3 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-red-500 h-11 md:h-12 w-full"
                    onClick={handleFacebookSignIn}
                  >
                    <ImFacebook className="w-4 h-4 mr-2" />{" "}
                    <span className="ml-2">{t("LoginWithFacebook")}</span>
                  </button>

                  {/* <button
                    // disabled
                    className="text-sm inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center rounded-md focus:outline-none text-gray-700 bg-gray-100 shadow-sm my-2 md:px-2 lg:px-3 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-blue-600 h-11 md:h-12 w-full mr-2"
                  >
                    <ImFacebook className="w-4 h-4 mr-2" />{" "}
                    <span className="ml-2"> {t("LoginWithFacebook")} </span>
                  </button> */}
                  <button
                    // disabled
                    className="text-sm inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center rounded-md focus:outline-none text-gray-700 bg-gray-100 shadow-sm my-2  md:px-2 lg:px-3 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-red-500 h-11 md:h-12 w-full"
                    onClick={handleGoogleSignIn}
                  >
                    <ImGoogle className="w-4 h-4 mr-2" />{" "}
                    <span className="ml-2">{t("LoginWithGoogle")}</span>
                  </button>
                </form>

                <p className="mt-4">
                  <Link
                    className="text-sm font-medium text-green-500 dark:text-green-400 hover:underline"
                    to="/forgot-password"
                  >
                    {t("ForgotPassword")}
                  </Link>
                </p>
                <p className="mt-1">
                  <Link
                    className="text-sm font-medium text-green-500 dark:text-green-400 hover:underline"
                    to="/signup"
                  >
                    {t("CreateAccountTitle")}
                  </Link>
                </p>
                {/* Added By : Govinda 4/23/2024  */}
                {/* For some Reasons link was not working so for it has been changed as button from my side  */}
                <p className="mt-4">
                  <button
                    className="text-sm font-medium text-green-500 dark:text-green-400 hover:underline"
                    onClick={() => history.push("/forgot-password")}
                  >
                    {t("ForgotPassword")}
                  </button>
                </p>
                <p className="mt-1">
                  <button
                    className="text-sm font-medium text-green-500 dark:text-green-400 hover:underline"
                    onClick={() => history.push("/signup")}
                  >
                    {t("CreateAccountTitle")}
                  </button>
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;





// import React, { useContext } from "react";
// // import { Link } from "react-router-dom";
// import { Button } from "@windmill/react-ui";
// // import { ImFacebook, ImGoogle } from "react-icons/im";
// import { useTranslation } from "react-i18next";
// import Error from "components/form/Error";
// import LabelArea from "components/form/LabelArea";
// import InputArea from "components/form/InputArea";
// import ImageLight from "assets/img/login-office.jpeg";
// import ImageDark from "assets/img/login-office-dark.jpeg";
// import useLoginSubmit from "../hooks/useLoginSubmit";
// import { AdminContext } from 'context/AdminContext';
// import { useHistory } from 'react-router-dom';
// import { notifySuccess } from "utils/toast";

// const Login = () => {
//   const { t } = useTranslation();
//   const { onSubmit, register, handleSubmit, errors, loading } =
//     useLoginSubmit();

//   const { dispatch } = useContext(AdminContext)
//   const history = useHistory();
//   let Email = localStorage.getItem("email");
//   const userStatus = () => {

//     if (Email) {
//       history.replace('/');
//       notifySuccess('Welcome back!');
//       dispatch({ type: 'USER_LOGIN', payload: { email: Email } });

//     }
//     else {
//       return true;
//     }
//   }
//   return (
//     userStatus()
//       ?
//       <>
//         <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
//           <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
//             <div className="flex flex-col overflow-y-auto md:flex-row">
//               <div className="h-32 md:h-auto md:w-1/2">
//                 <img
//                   aria-hidden="true"
//                   className="object-cover w-full h-full dark:hidden"
//                   src={ImageLight}
//                   alt="Office"
//                 />
//                 <img
//                   aria-hidden="true"
//                   className="hidden object-cover w-full h-full dark:block"
//                   src={ImageDark}
//                   alt="Office"
//                 />
//               </div>
//               <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
//                 <div className="w-full">
//                   <h1 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
//                     Login
//                   </h1>
//                   <form onSubmit={handleSubmit(onSubmit)}>
//                     <LabelArea label="Email" />
//                     <InputArea
//                       register={register}
//                       defaultValue="admin@gmail.com"
//                       label="Email"
//                       name="email"
//                       type="email"
//                       placeholder="john@doe.com"
//                     />
//                     <Error errorName={errors.email} />
//                     <div className="mt-6"></div>
//                     <LabelArea label="Password" />
//                     <InputArea
//                       register={register}
//                       defaultValue="12345678"
//                       label="Password"
//                       name="password"
//                       type="password"
//                       placeholder="***************"
//                     />
//                     <Error errorName={errors.password} />

//                     <Button
//                       disabled={loading}
//                       type="submit"
//                       className="mt-4 h-12 w-full"
//                       to="/dashboard"
//                     >
//                       {t("LoginTitle")}
//                     </Button>
//                     <hr className="my-10" />
//                     {/* <button
//                     disabled
//                     className="text-sm inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center rounded-md focus:outline-none text-gray-700 bg-gray-100 shadow-sm my-2 md:px-2 lg:px-3 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-blue-600 h-11 md:h-12 w-full mr-2"
//                   >
//                     <ImFacebook className="w-4 h-4 mr-2" />{" "}
//                     <span className="ml-2"> {t("LoginWithFacebook")} </span>
//                   </button>
//                   <button
//                     disabled
//                     className="text-sm inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center rounded-md focus:outline-none text-gray-700 bg-gray-100 shadow-sm my-2  md:px-2 lg:px-3 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-red-500 h-11 md:h-12 w-full"
//                   >
//                     <ImGoogle className="w-4 h-4 mr-2" />{" "}
//                     <span className="ml-2">{t("LoginWithGoogle")}</span>
//                   </button> */}
//                   </form>

//                   {/* <p className="mt-4">
//                   <Link
//                     className="text-sm font-medium text-green-500 dark:text-green-400 hover:underline"
//                     to="/forgot-password"
//                   >
//                     {t("ForgotPassword")}
//                   </Link>
//                 </p>
//                 <p className="mt-1">
//                   <Link
//                     className="text-sm font-medium text-green-500 dark:text-green-400 hover:underline"
//                     to="/signup"
//                   >
//                     {t("CreateAccountTitle")}
//                   </Link>
//                 </p> */}
//                 </div>
//               </main>
//             </div>
//           </div>
//         </div>
//       </>
//       : <></>
//   );
// };

// export default Login;
