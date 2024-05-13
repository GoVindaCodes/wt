import Ajv from "ajv";
import csvToJson from "csvtojson";
import * as dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { SidebarContext } from "context/SidebarContext";
import AttributeServices from "services/AttributeServices";
import CategoryServices from "services/CategoryServices";
import CouponServices from "services/CouponServices";
import CurrencyServices from "services/CurrencyServices";
import CustomerServices from "services/CustomerServices";
import LanguageServices from "services/LanguageServices";
import ProductServices from "services/ProductServices";
import SettingServices from "services/SettingServices";
import { notifyError, notifySuccess } from "utils/toast";
import useAsync from "./useAsync";

const categorySchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "object" },
    description: { type: "object" },
    icon: { type: "string" },
    status: { type: "string" },
  },
  required: ["name"],
};
const attributeSchema = {
  type: "object",
  properties: {
    status: { type: "string" },
    title: { type: "object" },
    name: { type: "object" },
    variants: { type: "array" },
    option: { type: "string" },
    type: { type: "string" },
  },
  required: ["name", "title"],
};
const couponSchema = {
  type: "object",
  properties: {
    title: { type: "object" },
    couponCode: { type: "string" },
    endTime: { type: "string" },
    discountPercentage: { type: "number" },
    minimumAmount: { type: "number" },
    productType: { type: "string" },
    logo: { type: "string" },
    discountType: { type: "object" },
    status: { type: "string" },
  },
  required: ["title", "couponCode", "endTime", "status"],
};
const customerSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string" },
  },
  required: ["name", "email"],
};

const useFilter = (data) => {
  const ajv = new Ajv({ allErrors: true });

  const [filter, setFilter] = useState("");
  const [sortedField, setSortedField] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchCoupon, setSearchCoupon] = useState("");
  const [searchOrder, setSearchOrder] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [attributeTitle, setAttributeTitle] = useState("");
  const [country, setCountry] = useState("");
  const [zone, setZone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [language, setLanguage] = useState("");
  const [currency, setCurrency] = useState("");
  const [pending, setPending] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [delivered, setDelivered] = useState([]);
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [time, setTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [dataTable, setDataTable] = useState([]); //DataTable for showing on table according to filtering
  const [todayOrder, setTodayOrder] = useState("");
  const [monthlyOrder, setMonthlyOrder] = useState("");
  const [totalOrder, setTotalOrder] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [filename, setFileName] = useState("");
  const [isDisabled, setIsDisable] = useState(false);
  const [shipping, setShipping] = useState("");
  const [newProducts] = useState([]);
  const currencyRef = useRef("");
  const searchRef = useRef("");
  const userRef = useRef("");
  const couponRef = useRef("");
  const orderRef = useRef("");
  const categoryRef = useRef("");
  const attributeRef = useRef("");
  const countryRef = useRef("");
  const languageRef = useRef("");
  const taxRef = useRef("");
  const shippingRef = useRef("");


  dayjs.extend(isBetween);
  dayjs.extend(isToday);
  const location = useLocation();
  const { lang, setIsUpdate, setLoading } = useContext(SidebarContext);
  const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);
  // console.log(" datas from filters : ", data)
  //service data filtering
  const serviceData = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - time);
    let services = data?.map((el) => {
      const newDate = new Date(el?.updatedAt).toLocaleString("en-US", {
        timeZone: globalSetting?.default_time_zone,
      });
      const newObj = {
        ...el,
        updatedDate: newDate === "Invalid Date" ? "" : newDate,
      };
      return newObj;
    });
    if (location.pathname === "/dashboard") {
      const orderPending = services?.filter(
        (statusP) => statusP.status === "Pending"
      );
      setPending(orderPending);
      const orderProcessing = services?.filter(
        (statusO) => statusO.status === "Processing"
      );
      setProcessing(orderProcessing);
      const orderDelivered = services?.filter(
        (statusD) => statusD.status === "Delivered"
      );
      setDelivered(orderDelivered);
      //daily total order calculation
      const todayServices = services?.filter((order) =>
        dayjs(order.createdAt).isToday()
      );
      const todayOrder = todayServices?.reduce(
        (preValue, currentValue) => preValue + currentValue.total,
        0
      );
      setTodayOrder(todayOrder);
      //monthly order calculation
      const monthlyServices = services?.filter((order) =>
        dayjs(order.createdAt).isBetween(
          new Date().setDate(new Date().getDate() - 30),
          new Date()
        )
      );
      const monthlyOrder = monthlyServices?.reduce(
        (preValue, currentValue) => preValue + currentValue.total,
        0
      );
      setMonthlyOrder(monthlyOrder);
      //total order calculation
      const totalOrder = services?.reduce(
        (preValue, currentValue) => preValue + currentValue.total,
        0
      );
      setTotalOrder(totalOrder);
    }
    //products filtering
    // if (filter) {
    // if (role && role !== "All") {
    if (filter && filter !== "Category") {
      services = services.filter((item) => item.parent === filter);
      console.log("hi", filter)
    }
    if (sortedField === "low") {
      services = services.sort((a, b) => a.originalPrice - b.originalPrice);
    }
    if (sortedField === "high") {
      services = services.sort((a, b) => b.originalPrice - a.originalPrice);
    }
    if (sortedField === "published") {
      services = services.filter((item) => item.status === "show");
    }
    if (sortedField === "unPublished") {
      services = services.filter((item) => item.status === "hide");
    }
    if (sortedField === "status-selling") {
      services = services.filter((item) => item.quantity > 0);
    }
    if (sortedField === "status-out-of-stock") {
      services = services.filter((item) => item.quantity === 0);
    }
    if (sortedField === "date-added-asc") {
      services = services.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    if (sortedField === "date-added-desc") {
      services = services.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (sortedField === "date-updated-asc") {
      services = services.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    }
    if (sortedField === "date-updated-desc") {
      services = services.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
    if (searchText) {
      services = services.filter((search) =>
        search?.title?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // if (filter === "All") {
    //   // Reset services to original data
    //   services = data;
    // }

    // if (sortedField === "low") {
    //   console.log("sorts It", services)
    //   services = services.sort((a, b) => a.price < b.price && -1);
    // }
    // if (sortedField === "high") {
    //   services = services.sort((a, b) => a.price > b.price && -1);
    // }
    // if (sortedField === "date-added-asc") {
    //   services = services.filter((item) => item.createdAt === 0);
    // }

    if (attributeTitle) {
      services = services.filter(
        (search) =>
          search?.title[lang]
            ?.toLowerCase()
            ?.includes(attributeTitle?.toLowerCase()) ||
          search?.attribute
            ?.toLowerCase()
            .includes(attributeTitle?.toLowerCase())
      );
    }

    // original Logics of categories before
    // if (categoryType) {
    //   services = services.filter(
    //     (search) =>
    //       search?.parent[lang]
    //         ?.toLowerCase()
    //         ?.includes(categoryType?.toLowerCase()) ||
    //       search?.category?.toLowerCase().includes(categoryType?.toLowerCase())
    //   );
    // }


    // if (categoryType) {
    //   services = services.filter(
    //     (search) => {
    //       const parentCategory = search?.name[lang]?.toLowerCase();
    //       const category = search?.category?.toLowerCase();
    //       const searchValue = categoryType?.toLowerCase();
    //       const parentCategoryIncludes = parentCategory?.includes(searchValue);
    //       const categoryIncludes = category?.includes(searchValue);

    //       console.log("Parent Category:", parentCategory);
    //       console.log("Category:", category);
    //       console.log("Search Value:", searchValue);
    //       console.log("Parent Category Includes:", parentCategoryIncludes);
    //       console.log("Category Includes:", categoryIncludes);

    //       return parentCategoryIncludes || categoryIncludes;
    //     }
    //   );
    // }


    // just added to test the datas replace with original logic when needed
    if (categoryType) {
      services = services.filter(category => {
        const { parent, children } = category;
        const lowercaseCategoryType = categoryType.toLowerCase();

        console.log("Category:", category);
        console.log("Lowercase Category Type:", lowercaseCategoryType);

        // Check if the parent category matches
        if (parent && parent.toLowerCase().includes(lowercaseCategoryType)) {
          console.log("Parent Category Matched:", parent);
          return true;
        }

        // Check if any of the children categories match
        if (children && children.some(child => child.toLowerCase().includes(lowercaseCategoryType))) {
          console.log("Child Category Matched:", children);
          return true;
        }

        return false;
      });
    }




    //admin Filtering
    // if (role) {
    //   services = services.filter((staff) => staff.role === role);
    // }
    // Added By : Govinda 3/5/2024
    // for all to select and makes it show all insteads
    if (role && role !== "All") {
      services = services.filter((staff) => staff.role === role);
      console.log("hi: ", services)
    }
    //User and Admin filtering
    if (searchUser) {
      services = services.filter(
        (search) =>
          search?.name[lang]
            ?.toLowerCase()
            .includes(searchUser.toLowerCase()) ||
          search?.phone?.toLowerCase().includes(searchUser.toLowerCase()) ||
          search?.email?.toLowerCase().includes(searchUser.toLowerCase())
      );
    }

    //Coupon filtering
    if (searchCoupon) {
      services = services?.filter(
        (search) =>
          search?.title[lang]
            ?.toLowerCase()
            ?.includes(searchCoupon?.toLowerCase()) ||
          search?.couponCode
            ?.toLowerCase()
            .includes(searchCoupon?.toLowerCase())
      );
    }
    // order filtering
    // if (status) {
    // Added By : Govinda 05/3/2024 just for Sorting It All
    if (status && status !== "Status") {
      services = services.filter((order) => order.status === status);
    }
    if (searchOrder) {
      services = services.filter((order) =>
        // Added By : Govinda 04/23/2024 just for thiss dataa
        order.user_info.name.toLowerCase().includes(searchOrder.toLowerCase())
      );
    }
    // Added By : Govinda 05/3/2024 just for Sorting It All
    // if (time) {
    if (time && time !== "Order limits") {
      services = services.filter((order) =>
        dayjs(order.createdAt).isBetween(date, new Date())
      );
    }

    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      services = services.filter((order) =>
        dayjs(order.createdAt).isBetween(startDateObj, endDateObj)
      );

      console.log("datess herees :", services)
    }
    // if (startDate && endDate) {
    //   services = services.filter((order) =>
    //     dayjs(order.createdAt).isBetween(startDate, endDate)
    //   );
    // }
    // if (startDate) {
    //   // Calculate the end date as the current date
    //   const currentDate = new Date();
    //   // Filter services based on the range from startDate to currentDate
    //   services = services.filter((order) =>
    //     dayjs(order.createdAt).isBetween(startDate, currentDate)
    //   );
    // }

    // if (endDate) {
    //   // Calculate the end date as the current date
    //   const currentDate = new Date();
    //   // Filter services based on the range from startDate to currentDate
    //   services = services.filter((order) =>
    //     dayjs(order.createdAt).isBetween(endDate, currentDate)
    //   );
    // }


    //country filtering
    if (country) {
      services = services.filter(
        (cou) =>
          cou?.name?.toLowerCase().includes(country.toLowerCase()) ||
          cou?.iso_code?.toLowerCase().includes(country.toLowerCase())
      );
    }

    //shipping filtering
    if (shipping) {
      services = services.filter((ship) =>
        ship?.name.toLowerCase().includes(shipping.toLowerCase())
      );
    }

    // previous Logics

    //language filtering
    // if (language) {
    //   services = services.filter(
    //     (lan) =>
    //       lan.name.toLowerCase().includes(language.toLowerCase()) ||
    //       lan.iso_code.toLowerCase().includes(language.toLowerCase()) ||
    //       lan.language_code.toLowerCase().includes(language.toLowerCase())
    //   );
    // }

    // Added By : Govinda 4/04/2024

    if (language) {
      services = services.filter((lan) => {
        const name = lan.name ? lan.name.toLowerCase() : '';
        const isoCode = lan.iso_code ? lan.iso_code.toLowerCase() : '';
        const languageCode = lan.language_code ? lan.language_code.toLowerCase() : '';

        return name.includes(language.toLowerCase()) ||
          isoCode.includes(language.toLowerCase()) ||
          languageCode.includes(language.toLowerCase());
      });
    }
    // Added By : Govinda 4/04/2024

    if (currency) {
      services = services.filter((cur) => {
        const isoCode = cur && cur.name ? cur.name.toLowerCase() : '';
        return isoCode.includes(currency.toLowerCase());
      });
    }

    // previous Logics

    // if (currency) {
    //   services = services.filter((cur) =>
    //     cur.iso_code.toLowerCase().includes(currency.toLowerCase())
    //   );
    // }
    // console.log("services : ", services)
    return services;
  }, [
    time,
    data,
    location.pathname,
    filter,
    sortedField,
    searchText,
    attributeTitle,
    categoryType,
    role,
    searchUser,
    searchCoupon,
    status,
    searchOrder,
    country,
    shipping,
    language,
    currency,
    globalSetting?.default_time_zone,
    lang,
  ]);

  //pagination functionality start
  // const resultsPerPage = 10;
  const totalResults = serviceData?.length;
  // console.log("hi from filters : ", totalResults)
  const handleChangePage = (p) => {
    console.log('Changing page to:', p);
    setCurrentPage(p);
    // setResultsPerPage(p);
  };
  // original Logics

  // useEffect(() => {
  //   console.log("Running useEffect for pagination");
  //   console.log("Current Page:", currentPage);
  //   console.log("Results Per Page:", resultsPerPage);
  //   setDataTable(
  //     serviceData?.slice(
  //       (currentPage - 1) * resultsPerPage,
  //       currentPage * resultsPerPage
  //     )
  //   );
  // }, [serviceData, currentPage, resultsPerPage]);
  // useEffect(() => {
  //   if (searchText) {
  //     setDataTable(serviceData);
  //     setCurrentPage(1); // Set currentPage to 1 when filters or searchText change
  //     setResultsPerPage(serviceData?.length || 1); // Set resultsPerPage to the length of serviceData
  //   } else {
  //     const totalResults = serviceData?.length || 0;
  //     const startIndex = Math.min((currentPage - 1) * resultsPerPage + 1, totalResults);
  //     const endIndex = Math.min(currentPage * resultsPerPage, totalResults);
  //     setDataTable(serviceData?.slice(startIndex - 1, endIndex) || []);
  //   }
  // }, [
  //   serviceData,
  //   currentPage,
  //   resultsPerPage,
  //   filter,
  //   sortedField,
  //   searchText,
  //   attributeTitle,
  //   categoryType,
  //   role,
  //   searchUser,
  //   searchCoupon,
  //   status,
  //   searchOrder,
  //   country,
  //   shipping,
  //   language,
  //   currency,
  // ]);
  // useEffect(() => {
  //   if (searchText) {
  //     // Reset currentPage to 1 when searchText changes
  //     setCurrentPage(1);
  //     // Update resultsPerPage based on the length of filtered data
  //     setResultsPerPage(serviceData?.length || 1);
  //     // Set the data table to display the filtered results
  //     setDataTable(serviceData);
  //   } else {
  //     // Calculate totalResults and pagination range when searchText is empty
  //     const totalResults = serviceData?.length || 0;
  //     const startCount = Math.min((currentPage - 1) * resultsPerPage + 1, totalResults);
  //     const endCount = Math.min(currentPage * resultsPerPage, totalResults);
  //     const displayText = `SHOWING ${startCount}-${endCount} OF ${totalResults}`;
  //     console.log(displayText);
  //     // Update data table to display the current page of results
  //     setDataTable(serviceData?.slice(startCount - 1, endCount) || []);
  //   }
  // }, [searchText, serviceData, currentPage, resultsPerPage, setCurrentPage, setResultsPerPage, setDataTable]);


  useEffect(() => {
    let slicedData;
    if (serviceData?.length > 0) {
      const startIndex = (currentPage - 1) * resultsPerPage;
      const endIndex = Math.min(currentPage * resultsPerPage, serviceData?.length);
      slicedData = serviceData.slice(startIndex, endIndex);
    } else {
      slicedData = serviceData;
    }
    // if (filter === "All") {
    //   setResultsPerPage(10);
    //   setDataTable(slicedData);
    // }
    const filtersActive =
      // filter ||
      // sortedField ||
      attributeTitle ||
      categoryType ||
      // role ||
      searchUser ||
      searchCoupon ||
      status ||
      searchOrder ||
      country ||
      shipping ||
      language ||
      // sortedField ||
      currency;

    if (filtersActive || searchText) {
      setCurrentPage(1);
      setResultsPerPage(serviceData?.length || 1);
      setDataTable(serviceData);
    } else {
      setResultsPerPage(10);
      setDataTable(slicedData);
    }
  }, [
    serviceData,
    currentPage,
    resultsPerPage,
    filter,
    sortedField,
    searchText,
    attributeTitle,
    categoryType,
    role,
    searchUser,
    searchCoupon,
    status,
    searchOrder,
    country,
    shipping,
    language,
    currency,
  ]);


  useEffect(() => {
    const totalResults = serviceData?.length || 0;
    const endCount = Math.min(currentPage * resultsPerPage, totalResults);
    const startCount = endCount > 0 ? Math.min((currentPage - 1) * resultsPerPage + 1, totalResults) : 0;
    const displayText = `SHOWING ${startCount}-${endCount} OF ${totalResults}`;
    // console.log(displayText);
  }, [serviceData, currentPage, resultsPerPage]);





  // useEffect(() => {
  //   if (searchText) {
  //     setDataTable(serviceData);
  //     setCurrentPage(1);
  //     setResultsPerPage(Math.min(resultsPerPage, serviceData?.length));
  //   } else {
  //     const startIndex = Math.min(
  //       (currentPage - 1) * resultsPerPage,
  //       serviceData?.length - 1
  //     );
  //     const endIndex = Math.min(currentPage * resultsPerPage, serviceData?.length);
  //     setDataTable(serviceData?.slice(startIndex, endIndex));
  //   }
  // }, [
  //   serviceData,
  //   currentPage,
  //   resultsPerPage,
  //   filter,
  //   sortedField,
  //   searchText,
  //   attributeTitle,
  //   categoryType,
  //   role,
  //   searchUser,
  //   searchCoupon,
  //   status,
  //   searchOrder,
  //   country,
  //   shipping,
  //   language,
  //   currency,
  // ]);

  // useEffect(() => {
  //   setDataTable(
  //     serviceData?.slice(
  //       (currentPage - 1) * resultsPerPage,
  //       currentPage * resultsPerPage
  //     )
  //   );
  // }, [serviceData, currentPage, resultsPerPage]);

  //pagination functionality end

  // useEffect(() => {
  //   let slicedData;
  //   if (serviceData?.length > 0 && !searchText) { // Only slice when not searching
  //     const startIndex = (currentPage - 1) * resultsPerPage;
  //     const endIndex = Math.min(currentPage * resultsPerPage, serviceData.length);
  //     slicedData = serviceData.slice(startIndex, endIndex);
  //   } else {
  //     slicedData = serviceData; // Keep the data as is if it's empty or when searching
  //   }
  //   setDataTable(slicedData);
  // }, [serviceData, currentPage, resultsPerPage, searchText]);

  // working logic with searching and reflectings in the datatables

  // useEffect(() => {
  //   let slicedData;
  //   if (serviceData?.length > 0) {
  //     const startIndex = (currentPage - 1) * resultsPerPage;
  //     const endIndex = Math.min(currentPage * resultsPerPage, serviceData.length);
  //     slicedData = serviceData.slice(startIndex, endIndex);
  //   } else {
  //     slicedData = serviceData;
  //   }
  //   const filtersActive =
  //     filter ||
  //     sortedField ||
  //     attributeTitle ||
  //     categoryType ||
  //     role ||
  //     searchUser ||
  //     searchCoupon ||
  //     status ||
  //     searchOrder ||
  //     country ||
  //     shipping ||
  //     language ||
  //     currency;

  //   if (filtersActive || searchText) {
  //     setDataTable(serviceData);
  //   } else {
  //     setDataTable(slicedData);
  //   }
  // }, [
  //   serviceData,
  //   currentPage,
  //   resultsPerPage,
  //   filter,
  //   sortedField,
  //   searchText,
  //   attributeTitle,
  //   categoryType,
  //   role,
  //   searchUser,
  //   searchCoupon,
  //   status,
  //   searchOrder,
  //   country,
  //   shipping,
  //   language,
  //   currency,
  // ]);

  // useEffect(() => {
  //   let slicedData;
  //   if (serviceData?.length > 0) {
  //     const startIndex = (currentPage - 1) * resultsPerPage;
  //     const endIndex = Math.min(currentPage * resultsPerPage, serviceData?.length);
  //     slicedData = serviceData.slice(startIndex, endIndex);
  //   } else {
  //     slicedData = serviceData;
  //   }
  //   const filtersActive =
  //     filter ||
  //     sortedField ||
  //     attributeTitle ||
  //     categoryType ||
  //     role ||
  //     searchUser ||
  //     searchCoupon ||
  //     status ||
  //     searchOrder ||
  //     country ||
  //     shipping ||
  //     language ||
  //     currency;

  //   if (filtersActive || searchText) {
  //     setDataTable(serviceData);
  //     setCurrentPage(0); // Set currentPage to 1 when filters or searchText change
  //   } else {
  //     setDataTable(slicedData);
  //   }
  // }, [
  //   serviceData,
  //   currentPage,
  //   resultsPerPage,
  //   filter,
  //   sortedField,
  //   searchText,
  //   attributeTitle,
  //   categoryType,
  //   role,
  //   searchUser,
  //   searchCoupon,
  //   status,
  //   searchOrder,
  //   country,
  //   shipping,
  //   language,
  //   currency,
  // ]);

  // useEffect(() => {
  //   let slicedData;
  //   if (serviceData?.length > 0) {
  //     const startIndex = (currentPage - 1) * resultsPerPage;
  //     const endIndex = Math.min(currentPage * resultsPerPage, serviceData?.length);
  //     slicedData = serviceData.slice(startIndex, endIndex);
  //   } else {
  //     slicedData = serviceData;
  //   }
  //   const filtersActive =
  //     filter ||
  //     sortedField ||
  //     attributeTitle ||
  //     categoryType ||
  //     role ||
  //     searchUser ||
  //     searchCoupon ||
  //     status ||
  //     searchOrder ||
  //     country ||
  //     shipping ||
  //     language ||
  //     currency;

  //   if (filtersActive || searchText) {
  //     setDataTable(serviceData);
  //     setCurrentPage(1); // Set currentPage to 1 when filters or searchText change
  //   } else {
  //     setDataTable(slicedData);
  //   }
  // }, [
  //   serviceData,
  //   currentPage,
  //   resultsPerPage,
  //   filter,
  //   sortedField,
  //   searchText,
  //   attributeTitle,
  //   categoryType,
  //   role,
  //   searchUser,
  //   searchCoupon,
  //   status,
  //   searchOrder,
  //   country,
  //   shipping,
  //   language,
  //   currency,
  // ]);





  // useEffect(() => {
  //   let slicedData;
  //   if (serviceData?.length > 0) {
  //     const startIndex = currentPage === 1 ? 0 : (currentPage - 1) * resultsPerPage;
  //     const endIndex = Math.min(currentPage * resultsPerPage, serviceData?.length);
  //     slicedData = serviceData.slice(startIndex, endIndex);
  //   } else {
  //     slicedData = serviceData;
  //   }
  //   const filtersActive =
  //     filter ||
  //     sortedField ||
  //     attributeTitle ||
  //     categoryType ||
  //     role ||
  //     searchUser ||
  //     searchCoupon ||
  //     status ||
  //     searchOrder ||
  //     country ||
  //     shipping ||
  //     language ||
  //     currency;

  //   if (filtersActive || searchText) {
  //     setDataTable(serviceData);
  //     // setCurrentPage(1); // Set currentPage to 1 when filters or searchText change
  //   } else {
  //     setDataTable(slicedData);
  //   }
  // }, [
  //   serviceData,
  //   currentPage,
  //   resultsPerPage,
  //   filter,
  //   sortedField,
  //   searchText,
  //   attributeTitle,
  //   categoryType,
  //   role,
  //   searchUser,
  //   searchCoupon,
  //   status,
  //   searchOrder,
  //   country,
  //   shipping,
  //   language,
  //   currency,
  // ]);


  //table form submit function for search start
  const handleSubmitForAll = (e) => {
    console.log("hi: ", searchRef.current.value)
    e.preventDefault();
    setSearchText(searchRef.current.value);
    setCurrentPage(1);
    // handleChangePage(0);// Reset current page to 1 after search
    // setResultsPerPage(setCurrentPage);
  };
  const handleSubmitUser = (e) => {
    e.preventDefault();
    setSearchUser(userRef.current.value);
  };
  const handleSubmitCoupon = (e) => {
    e.preventDefault();
    // console.log("hi : ", couponRef.current.value)
    setSearchCoupon(couponRef.current.value);
  };
  const handleSubmitOrder = (e) => {
    // console.log("hi : ", orderRef.current.value)
    e.preventDefault();
    setSearchOrder(orderRef.current.value);
  };
  const handleSubmitCategory = (e) => {
    console.log("hi : ", categoryRef.current.value)
    e.preventDefault();
    setCategoryType(categoryRef.current.value);
  };
  const handleSubmitAttribute = (e) => {
    e.preventDefault();
    setAttributeTitle(attributeRef.current.value);
  };

  const handleSubmitCountry = (e) => {
    e.preventDefault();
    setCountry(countryRef.current.value);
  };

  const handleSubmitShipping = (e) => {
    e.preventDefault();
    setShipping(shippingRef.current.value);
  };
  const handleSubmitLanguage = (e) => {
    e.preventDefault();
    setLanguage(languageRef.current.value);
  };
  const handleSubmitCurrency = (e) => {
    e.preventDefault();
    setCurrency(currencyRef.current.value);
  };
  // table form submit function for search end
  // handle submit multiple product data with csv format
  const handleOnDrop = (data) => {
    for (let i = 0; i < data.length; i++) {
      newProducts.push(data[i].data);
    }
  };
  const handleUploadProducts = () => {
    if (newProducts.length < 1) {
      notifyError("Please upload/select csv file first!");
    } else {
      // notifySuccess('CRUD operation disable for demo!');
      ProductServices.addAllProducts(newProducts)
        .then((res) => {
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
    }
  };
  const handleSelectFile = (e) => {
    e.preventDefault();

    const fileReader = new FileReader();
    const file = e.target?.files[0];

    if (file && file.type === "application/json") {
      setFileName(file?.name);
      setIsDisable(true);

      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = (e) => {
        let text = JSON.parse(e.target.result);

        let data = [];
        if (location.pathname === "/categories") {
          data = text.map((value) => {
            return {
              _id: value._id,
              id: value.id,
              status: value.status,
              name: value.name,
              description: value.description,
              parentName: value.parentName,
              parentId: value.parentId,
              icon: value.icon,
            };
          });
        }
        if (location.pathname === "/attributes") {
          data = text.map((value) => {
            return {
              _id: value._id,
              status: value.status,
              title: value.title,
              name: value.name,
              variants: value.variants,
              option: value.option,
              type: value.type,
            };
          });
        }

        if (location.pathname === "/coupons") {
          data = text.map((value) => {
            return {
              title: value.title,
              couponCode: value.couponCode,
              endTime: value.endTime,
              discountPercentage: value.discountPercentage,
              minimumAmount: value.minimumAmount,
              productType: value.productType,
              logo: value.logo,
              discountType: value.discountType,
              status: value.status,
            };
          });
        }
        if (location.pathname === "/customers") {
          data = text.map((value) => {
            return {
              name: value.name,
              email: value.email,
              password: value.password,
              phone: value.phone,
            };
          });
        }
        setSelectedFile(data);
      };
    } else if (file && file.type === "text/csv") {
      setFileName(file?.name);
      setIsDisable(true);

      fileReader.onload = async (event) => {
        const text = event.target.result;
        const json = await csvToJson().fromString(text);
        console.log("json", json);
        let data = [];

        if (location.pathname === "/categories") {
          data = json.map((value) => {
            return {
              _id: value._id,
              id: value.id,
              status: value.status,
              name: JSON.parse(value.name),
              description: JSON.parse(value.description),
              parentName: value.parentName,
              parentId: value.parentId,
              icon: value.icon,
            };
          });
        }
        if (location.pathname === "/attributes") {
          data = json.map((value) => {
            return {
              status: value.status,
              title: JSON.parse(value.title),
              name: JSON.parse(value.name),
              variants: JSON.parse(value.variants),
              option: value.option,
              type: value.type,
            };
          });
        }

        if (location.pathname === "/coupons") {
          data = json.map((value) => {
            return {
              title: JSON.parse(value.title),
              couponCode: value.couponCode,
              endTime: value.endTime,
              discountPercentage: value.discountPercentage
                ? JSON.parse(value.discountPercentage)
                : 0,
              minimumAmount: value.minimumAmount
                ? JSON.parse(value.minimumAmount)
                : 0,
              productType: value.productType,
              logo: value.logo,
              // discountType: JSON.parse(value.discountType),
              status: value.status,
            };
          });
        }
        if (location.pathname === "/customers") {
          data = json.map((value) => {
            return {
              name: value.name,
              email: value.email,
              password: value.password,
              phone: value.phone,
            };
          });
        }
        setSelectedFile(data);
      };
      fileReader.readAsText(file);
    } else {
      setFileName(file?.name);
      setIsDisable(true);

      const rABS = !!fileReader.readAsBinaryString;

      fileReader.onload = function (event) {
        /* Parse data */
        const bstr = event.target.result;
        const wb = XLSX.read(bstr, {
          type: rABS ? "binary" : "array",
          bookVBA: true,
        });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const json = XLSX.utils.sheet_to_json(ws);

        let data = [];

        if (location.pathname === "/categories") {
          data = json.map((value) => {
            return {
              _id: value._id,
              id: value.id,
              status: value.status,
              name: JSON.parse(value.name),
              description: JSON.parse(value.description),
              parentName: value.parentName,
              parentId: value.parentId,
              icon: value.icon,
            };
          });
        }
        if (location.pathname === "/attributes") {
          data = json.map((value) => {
            return {
              status: value.status,
              title: JSON.parse(value.title),
              name: JSON.parse(value.name),
              variants: JSON.parse(value.variants),
              option: value.option,
              type: value.type,
            };
          });
        }

        if (location.pathname === "/coupons") {
          data = json.map((value) => {
            return {
              title: JSON.parse(value.title),
              couponCode: value.couponCode,
              endTime: value.endTime,
              discountPercentage: value.discountPercentage,
              minimumAmount: value.minimumAmount,
              productType: value.productType,
              logo: value.logo,
              // discountType: JSON.parse(value.discountType),
              status: value.status,
            };
          });
        }
        if (location.pathname === "/customers") {
          data = json.map((value) => {
            return {
              name: value.name,
              email: value.email,
              password: value.password ? value.password : "null",
              phone: value.phone ? value.phone : "null",
            };
          });
        }
        setSelectedFile(data);
      };

      if (rABS) {
        fileReader.readAsBinaryString(file);
      } else {
        fileReader.readAsArrayBuffer(file);
      }
    }
  };

  const handleUploadMultiple = (e) => {
    notifyError("This feature is disabled for demo!");
    // return;
    // console.log('select file', selectedFile, location.pathname);
    if (selectedFile.length > 1) {
      if (location.pathname === "/categories") {
        setLoading(true);
        let categoryDataValidation = selectedFile.map((value) =>
          ajv.validate(categorySchema, value)
        );

        const isBelowThreshold = (currentValue) => currentValue === true;
        const validationData = categoryDataValidation.every(isBelowThreshold);

        if (validationData) {
          CategoryServices.addAllCategory(selectedFile)
            .then((res) => {
              setLoading(false);
              setIsUpdate(true);
              notifySuccess(res.message);
            })
            .catch((err) => {
              setLoading(false);
              notifyError(err ? err.response.data.message : err.message);
            });
        } else {
          notifyError("Please enter valid data!");
        }
      }
      if (location.pathname === "/customers") {
        setLoading(true);
        let customerDataValidation = selectedFile.map((value) =>
          ajv.validate(customerSchema, value)
        );

        const isBelowThreshold = (currentValue) => currentValue === true;
        const validationData = customerDataValidation.every(isBelowThreshold);

        console.log(validationData);
        console.log(customerDataValidation);

        if (validationData) {
          CustomerServices.addAllCustomers(selectedFile)
            .then((res) => {
              setLoading(false);
              setIsUpdate(true);
              notifySuccess(res.message);
            })
            .catch((err) => {
              setLoading(false);
              notifyError(err ? err.response.data.message : err.message);
            });
        } else {
          notifyError("Please enter valid data!");
        }
      }
      if (location.pathname === "/coupons") {
        setLoading(true);
        let attributeDataValidation = selectedFile.map((value) =>
          ajv.validate(couponSchema, value)
        );

        const isBelowThreshold = (currentValue) => currentValue === true;
        const validationData = attributeDataValidation.every(isBelowThreshold);

        if (validationData) {
          CouponServices.addAllCoupon(selectedFile)
            .then((res) => {
              setLoading(false);
              setIsUpdate(true);
              notifySuccess(res.message);
            })
            .catch((err) => {
              setLoading(false);
              notifyError(err ? err.response.data.message : err.message);
            });
        } else {
          notifyError("Please enter valid data!");
        }
      }
      if (location.pathname === "/attributes") {
        setLoading(true);
        let attributeDataValidation = selectedFile.map((value) =>
          ajv.validate(attributeSchema, value)
        );

        const isBelowThreshold = (currentValue) => currentValue === true;
        const validationData = attributeDataValidation.every(isBelowThreshold);

        if (validationData) {
          AttributeServices.addAllAttributes(selectedFile)
            .then((res) => {
              setLoading(false);
              setIsUpdate(true);
              notifySuccess(res.message);
            })
            .catch((err) => {
              setLoading(false);
              notifyError(err ? err.response.data.message : err.message);
            });
        } else {
          notifyError("Please enter valid data!");
        }
      }

      if (location.pathname === "/languages") {
        LanguageServices.addAllLanguage(selectedFile)
          .then((res) => {
            setIsUpdate(true);
            notifySuccess(res.message);
          })
          .catch((err) =>
            notifyError(err ? err.response.data.message : err.message)
          );
      }

      if (location.pathname === "/currencies") {
        CurrencyServices.addAllCurrency(selectedFile)
          .then((res) => {
            setIsUpdate(true);
            notifySuccess(res.message);
          })
          .catch((err) =>
            notifyError(err ? err.response.data.message : err.message)
          );
      }
    } else {
      notifyError("Please select a valid .JSON/.CSV/.XLS file first!");
    }
  };

  const handleRemoveSelectFile = (e) => {
    // console.log('remove');
    setFileName("");
    setSelectedFile([]);
    setTimeout(() => setIsDisable(false), 1000);
  };

  return {
    userRef,
    searchRef,
    couponRef,
    orderRef,
    categoryRef,
    attributeRef,
    pending,
    processing,
    delivered,
    todayOrder,
    monthlyOrder,
    totalOrder,
    setFilter,
    setSortedField,
    setStatus,
    setRole,
    time,
    setTime,
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleSubmitUser,
    handleSubmitForAll,
    handleSubmitCoupon,
    handleSubmitOrder,
    handleSubmitCategory,
    handleSubmitAttribute,
    handleOnDrop,
    handleUploadProducts,
    countryRef,
    country,
    setCountry,
    zone,
    setZone,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    handleSubmitCountry,
    languageRef,
    handleSubmitLanguage,
    handleSelectFile,
    handleUploadMultiple,
    filename,
    isDisabled,
    handleRemoveSelectFile,
    taxRef,
    currencyRef,
    handleSubmitCurrency,
    handleSubmitShipping,
    shippingRef,
    globalSetting,
    currentPage,
  };
};

export default useFilter;
