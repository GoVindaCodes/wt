import React from "react";
import SelectLanguageTwo from "./SelectLanguageTwo";

const Title = ({ title, description, handleSelectLanguage, register }) => {
  return (
    <>
      {/* <div className="flex md:flex-row flex-col justify-between mr-20"> */}
      {/* removed margin 20 becuase tester asked me to remove one cancel either cross or cancel */}
      <div className="flex md:flex-row flex-col justify-between">
        <div>
          <h4 className="text-xl font-medium dark:text-gray-300">{title}</h4>
          <p className="mb-0 text-sm dark:text-gray-300">{description}</p>
        </div>
        {handleSelectLanguage && (
          <SelectLanguageTwo
            handleSelectLanguage={handleSelectLanguage}
            register={register}
          />
        )}
      </div>
    </>
  );
};

export default Title;
