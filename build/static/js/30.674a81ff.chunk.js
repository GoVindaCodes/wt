(this["webpackJsonpdashtar-admin"]=this["webpackJsonpdashtar-admin"]||[]).push([[30],{1245:function(e,t,s){"use strict";s.r(t);var a=s(0),o=s(35),c=s(633),r=s(90),n=s(65),l=s(92),i=s.p+"static/media/login-office.c7786a89.jpeg",d=s.p+"static/media/login-office-dark.c7786a89.jpeg",m=s(725),g=s(43),b=s(12),j=s(15),u=s(756),h=s(886),p=s(1170),f=s(1228),x=s(899),O=s(91),y=s(2);t.default=()=>{const{t:e}=Object(c.a)(),{onSubmit:t,register:s,handleSubmit:w,errors:k,loading:N}=Object(m.a)(),{dispatch:v}=Object(a.useContext)(g.a),S=Object(b.useHistory)(),L=Object(b.useLocation)(),{googleLoginAdmin:I}=O.a,G=Object(p.a)({apiKey:"AIzaSyBGAVOqfuKYCJ8B3D42cI4JA7W-I0-rGr4",authDomain:"ecomdaddyy.firebaseapp.com",projectId:"ecomdaddyy",storageBucket:"ecomdaddyy.appspot.com",messagingSenderId:"932602306808",appId:"1:932602306808:web:463676993d7d5ab81bdb0d",measurementId:"G-YLF5X1P9RD"}),F=(Object(f.a)(G),Object(x.c)());return Object(a.useEffect)((()=>{const e=localStorage.getItem("email");if(e){const{from:t}=L.state||{from:{pathname:"/"}};S.replace(t),Object(j.c)("Welcome back!"),v({type:"USER_LOGIN",payload:{email:e}})}}),[v,S,L.state]),Object(y.jsx)(y.Fragment,{children:Object(y.jsx)("div",{className:"flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900",children:Object(y.jsx)("div",{className:"flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800",children:Object(y.jsxs)("div",{className:"flex flex-col overflow-y-auto md:flex-row",children:[Object(y.jsxs)("div",{className:"h-32 md:h-auto md:w-1/2",children:[Object(y.jsx)("img",{"aria-hidden":"true",className:"object-cover w-full h-full dark:hidden",src:i,alt:"Office"}),Object(y.jsx)("img",{"aria-hidden":"true",className:"hidden object-cover w-full h-full dark:block",src:d,alt:"Office"})]}),Object(y.jsx)("main",{className:"flex items-center justify-center p-6 sm:p-12 md:w-1/2",children:Object(y.jsxs)("div",{className:"w-full",children:[Object(y.jsx)("h1",{className:"mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200",children:"Login"}),Object(y.jsxs)("form",{onSubmit:w(t),children:[Object(y.jsx)(n.a,{label:"Email"}),Object(y.jsx)(l.a,{register:s,defaultValue:"",label:"Email",name:"email",type:"email",placeholder:"Enter Your Email....."}),Object(y.jsx)(r.a,{errorName:k.email}),Object(y.jsx)("div",{className:"mt-6"}),Object(y.jsx)(n.a,{label:"Password"}),Object(y.jsx)(l.a,{register:s,defaultValue:"",label:"Password",name:"password",type:"password",placeholder:"***************"}),Object(y.jsx)(r.a,{errorName:k.password}),Object(y.jsx)(o.Button,{disabled:N,type:"submit",className:"mt-4 h-12 w-full",to:"/dashboard",children:e("LoginTitle")}),Object(y.jsx)("hr",{className:"my-10"}),Object(y.jsxs)("button",{className:"text-sm inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center rounded-md focus:outline-none text-gray-700 bg-gray-100 shadow-sm my-2  md:px-2 lg:px-3 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-red-500 h-11 md:h-12 w-full",onClick:async()=>{try{const e=new x.a,t=(await Object(x.d)(F,e)).user;console.log("Facebook sign-in successful:",t),Object(j.c)("Logged in successfully"),S.replace("/")}catch(e){console.error("Facebook sign-in error:",e),Object(j.b)("Failed to sign in with Facebook")}},children:[Object(y.jsx)(h.a,{className:"w-4 h-4 mr-2"})," ",Object(y.jsx)("span",{className:"ml-2",children:e("LoginWithFacebook")})]}),Object(y.jsxs)("button",{className:"text-sm inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center rounded-md focus:outline-none text-gray-700 bg-gray-100 shadow-sm my-2  md:px-2 lg:px-3 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-red-500 h-11 md:h-12 w-full",onClick:async()=>{try{const e=new x.b,t=await Object(x.d)(F,e);console.log("Google sign-in successful:",t);const s=t.user,a=await s.getIdToken();console.log("Google sign-in successful:",s),console.log("Google sign-in successful:",s.email),console.log("Google sign-in successful:",s.accessToken);const o=await I({tokenId:a});console.log("Google Response:",o),console.log("Google Resposnes:",o),o.accessToken?(Object(j.c)("Logged in successfully"),v({type:"USER_LOGIN",payload:{token:o.accessToken}}),localStorage.setItem("email",s.email),S.replace("/")):Object(j.b)("Failed to log in with Google")}catch(e){console.error("Google sign-in error:",e),Object(j.b)("Failed to sign in with Google")}},children:[Object(y.jsx)(h.b,{className:"w-4 h-4 mr-2"})," ",Object(y.jsx)("span",{className:"ml-2",children:e("LoginWithGoogle")})]})]}),Object(y.jsx)("p",{className:"mt-4",children:Object(y.jsx)(u.Link,{className:"text-sm font-medium text-green-500 dark:text-green-400 hover:underline",to:"/forgot-password",children:e("ForgotPassword")})}),Object(y.jsx)("p",{className:"mt-1",children:Object(y.jsx)(u.Link,{className:"text-sm font-medium text-green-500 dark:text-green-400 hover:underline",to:"/signup",children:e("CreateAccountTitle")})}),Object(y.jsx)("p",{className:"mt-4",children:Object(y.jsx)("button",{className:"text-sm font-medium text-green-500 dark:text-green-400 hover:underline",onClick:()=>S.push("/forgot-password"),children:e("ForgotPassword")})}),Object(y.jsx)("p",{className:"mt-1",children:Object(y.jsx)("button",{className:"text-sm font-medium text-green-500 dark:text-green-400 hover:underline",onClick:()=>S.push("/signup"),children:e("CreateAccountTitle")})})]})})]})})})})}},725:function(e,t,s){"use strict";var a=s(16),o=s.n(a),c=s(0),r=s(168),n=s(12),l=s(43),i=s(91),d=s(15);t.a=()=>{const[e,t]=Object(c.useState)(!1),{dispatch:s}=Object(c.useContext)(l.a),a=Object(n.useHistory)(),m=Object(n.useLocation)(),{register:g,handleSubmit:b,formState:{errors:j}}=Object(r.a)();return{onSubmit:e=>{let{name:c,email:r,phone:n,verifyEmail:l,password:g,role:b}=e;t(!0);"/login"===m.pathname&&i.a.loginAdmin({email:r,password:g}).then((e=>{e&&e.token&&(console.log("Login response:",e),o.a.set("adminInfo",JSON.stringify(e),{expires:.5}),t(!1),Object(d.c)("Login Success!"),s({type:"USER_LOGIN",payload:{token:e.token}}),localStorage.setItem("email",r),a.replace("/"))})).catch((e=>{console.error("Login error:",e),Object(d.b)(e?e.response.data.message:e.message),t(!1)})),"/signup"===m.pathname&&i.a.registerAdmin({name:c,email:r,phone:n,password:g,role:b}).then((e=>{e&&(t(!1),Object(d.c)("Register Success!"),s({type:"USER_LOGIN",payload:e}),o.a.set("adminInfo",JSON.stringify(e),{expires:.5}),a.replace("/"))})).catch((e=>{Object(d.b)(e?e.response.data.message:e.message),t(!1)})),"/forgot-password"===m.pathname&&(console.log("Forgot Password form submitted:",l),i.a.forgetPassword({verifyEmail:l}).then((e=>{t(!1),console.log("Password reset response:",e),Object(d.c)(e.message)})).catch((e=>{t(!1),console.error("Password reset error:",e),Object(d.b)(e?e.response.data.message:e.message)})))},register:g,handleSubmit:b,errors:j,loading:e}}},808:function(e,t){},809:function(e,t){},840:function(e,t){}}]);
//# sourceMappingURL=30.674a81ff.chunk.js.map