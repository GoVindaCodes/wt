import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import BulkActionDrawer from "components/drawer/BulkActionDrawer";
import CurrencyDrawer from "components/drawer/CurrencyDrawer";
import MainDrawer from "components/drawer/MainDrawer";
import DeleteModal from "components/modal/DeleteModal";
import PageTitle from "components/Typography/PageTitle";
import { SidebarContext } from "context/SidebarContext";
// import useAsync from "hooks/useAsync";
import useFilter from "hooks/useFilter";
import useToggleDrawer from "hooks/useToggleDrawer";
import { t } from "i18next";
import React, { useState, useContext, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
// import CurrencyServices from "services/CurrencyServices";
import { FiPlus } from "react-icons/fi";
import TableLoading from "components/preloader/TableLoading";
import CheckBox from "components/form/CheckBox";
import CurrencyTable from "components/currency/CurrencyTable";
import NotFound from "components/table/NotFound";
import currencies from "utils/currency";
import CurrencyServices from "services/CurrencyServices";
import useAsync from "hooks/useAsync";
import requests from "services/httpService";

const Currencies = () => {
  const { toggleDrawer } = useContext(SidebarContext);
  const { allId, serviceId, handleUpdateMany, handleDeleteMany } = useToggleDrawer();
  const { data, loading } = useAsync(CurrencyServices.getAllCurrency);
  // const data = currencies;
  // console.log("currencies", currencies);
  const {
    totalResults,
    resultsPerPage,
    dataTable,
    handleChangePage,
    handleSubmitCurrency,
    currencyRef,
    serviceData,
    currentPage,
  } = useFilter(data);
  useEffect(() => {
    console.log("current page : ", currentPage)
  }, [currentPage])

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  // console.log("currrencies", currencies);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(isCheckAll ? [] : Array.from({ length: currencies.length }, (_, index) => index));
    console.log("Selected IDs:", isCheck);
    setIsCheckAll(!isCheckAll);
    setIsCheck(data.map((li) => li._id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };


  // const [coupons, setCoupons] = useState([]);
  // console.log("allID : ", allId)
  // useEffect(() => {
  //   const fetchLanguages = async () => {
  //     try {
  //       console.log("Fetching Coupons...");
  //       const response = await requests.get('/api/currency');
  //       console.log("Coupons fetched successfully:", response);
  //       setCoupons(response);
  //     } catch (error) {
  //       console.error('Error fetching languages:', error);
  //     }
  //   };
  //   fetchLanguages();
  // }, []);

  return (
    <>
      <PageTitle>Currencies</PageTitle>
      <BulkActionDrawer ids={allId} title="Currencies" />
      <MainDrawer>
        <CurrencyDrawer />
      </MainDrawer>
      <DeleteModal
        ids={allId}
        setIsCheck={setIsCheck}
        title="Selected Currencies"
      />

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmitCurrency}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex md:justify-between"
          >
            <div className="w-full">
              <Input
                ref={currencyRef}
                type="search"
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                placeholder={t("SearchIsoCode")}
              />
            </div>
            <div className="lg:flex  md:flex xl:justify-end xl:w-1/2  md:w-full md:justify-start flex-grow-0">
              <div className="w-full md:w-40 lg:w-40 xl:w-40 mr-3 mb-3 lg:mb-0">
                <Button
                  disabled={isCheck.length < 1}
                  onClick={() => handleUpdateMany(isCheck)}
                  className="w-full rounded-md h-12 btn-gray text-gray-600"
                >
                  <span className="mr-2">
                    <FiEdit />
                  </span>
                  Bulk Action
                </Button>
              </div>

              <div className="w-full md:w-32 lg:w-32 xl:w-32 mr-3 mb-3 lg:mb-0">
                <Button
                  disabled={isCheck.length < 1}
                  onClick={() => handleDeleteMany(isCheck)}
                  className="w-full rounded-md h-12 bg-red-500 btn-red"
                >
                  <span className="mr-2">
                    <FiTrash2 />
                  </span>
                  Delete
                </Button>
              </div>
              <Button onClick={toggleDrawer} className="rounded-md h-12 w-full">
                <span className="mr-2">
                  <FiPlus />
                </span>
                Add Currency
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {
        // false
        loading
          ? (
            // <Loading loading={loading} />
            <TableLoading row={12} col={7} width={163} height={20} />
          ) : (
            serviceData.length !== 0 && (
              // coupons.length !== 0 && (
              <TableContainer className="mb-8 rounded-b-lg">
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>
                        <CheckBox
                          type="checkbox"
                          name="selectAll"
                          id="selectAll"
                          isChecked={isCheckAll}
                          handleClick={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        {t("CurrenciesName")}
                      </TableCell>
                      {/* <TableCell className="text-center">{t("Currencyisocode")}</TableCell> */}
                      <TableCell className="text-center">
                        {t("CurrenciesSymbol")}
                      </TableCell>

                      <TableCell className="text-center">
                        {t("CurrenciesEnabled")}
                      </TableCell>

                      <TableCell className="text-right">
                        {t("CurrenciesActions")}
                      </TableCell>
                    </tr>
                  </TableHeader>
                  <CurrencyTable
                    // data={data}
                    // currency={data}
                    currency={dataTable}
                    isCheck={isCheck}
                    setIsCheck={setIsCheck}
                  />
                </Table>
                <TableFooter>
                  <Pagination
                    currentPage={currentPage}
                    totalResults={totalResults}
                    resultsPerPage={resultsPerPage}
                    onChange={handleChangePage}
                    label="Table navigation"
                  />
                </TableFooter>
              </TableContainer>
            )
          )}
      {!true && data.length === 0 && (
        <NotFound title="Sorry, There are no currency right now." />
      )}
    </>
  );
};

export default Currencies;
