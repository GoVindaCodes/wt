import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
//internal import
import useToggleDrawer from "hooks/useToggleDrawer";
import AttributeDrawer from "components/drawer/AttributeDrawer";
import MainDrawer from "components/drawer/MainDrawer";
import CheckBox from "components/form/CheckBox";
import ShowHideButton from "components/table/ShowHideButton";
import Tooltip from "components/tooltip/Tooltip";
import EditDeleteButton from "components/table/EditDeleteButton";
import DeleteModal from "components/modal/DeleteModal";
import AttributeServices from "services/AttributeServices";
import { showingTranslateValue } from "utils/translate";
import useAsync from "hooks/useAsync";
import requests from "services/httpService";
// import { showingTranslateValue } from "utils/translate";

const AttributeTable = ({ isCheck, setIsCheck, attributes }) => {
  const { title, serviceId, handleModalOpen, handleUpdate, lang } = useToggleDrawer();
  const { data, loading } = useAsync(AttributeServices.getAllAttributes);

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };
  return (
    <>
      {isCheck.length < 1 && <DeleteModal id={serviceId} title={title} />}

      {isCheck.length < 2 && (
        //Added By: Govinda 25/3/2024
        <MainDrawer>
          <AttributeDrawer id={serviceId} />
        </MainDrawer>
      )}

      <TableBody>
        {attributes?.map((attribute) => (
          <TableRow key={attribute._id}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name="attribute"
                id={attribute._id}
                handleClick={handleClick}
                isChecked={isCheck?.includes(attribute._id)}
              />
            </TableCell>

            <TableCell className="font-semibold uppercase text-xs">
              {attribute?._id?.substring(0, 6)}
            </TableCell>

            {/* <TableCell className="font-medium text-sm"> */}
            {/* {showingTranslateValue(attribute.title.en, lang)} */}
            {/* added by : Govinda 10/4/2024 */}
            {/* {attribute.title.en} */}
            {/* </TableCell> */}


            {/* added by : Govinda 10/4/2024 */}
            {/* {attribute.title.en} */}
            <TableCell className="font-medium text-sm">
              {showingTranslateValue(attribute.name.en, lang)}
            </TableCell>

            {/* <TableCell className="font-medium text-sm">
              {attribute.variants}
            </TableCell> */}

            {/* added by : Govinda 10/4/2024 */}

            {/* {attribute.title.en} */}

            {/* and variants map since its an array in the given backend code  */}

            <TableCell className="font-medium text-sm">
              {attribute.variants.map((variant, index) => (
                <div key={index}>{variant.name.en} - {variant.status}</div>
              ))}
            </TableCell>

            <TableCell className="font-medium text-sm">
              {attribute.option}
            </TableCell>

            <TableCell className="text-center">
              <ShowHideButton id={attribute._id} status={attribute.status} />
            </TableCell>

            {/* just for now commented for the backends datas */}


            <TableCell className="flex justify-center">
              <Link
                to={`/attributes/${attribute._id}`}
                className="p-2 cursor-pointer text-gray-400 hover:text-green-600 focus:outline-none"
              >
                <Tooltip
                  id="edit values"
                  Icon={FiEdit}
                  title="Edit Values"
                  bgColor="#10B981"
                />
              </Link>
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={attribute._id}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={attribute.title[lang]}
              // onClick={() => deleteAttribute(attribute._id)} // Call deleteAttribute function with attribute id
              // title={showingTranslateValue(attribute.title, lang)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default AttributeTable;
