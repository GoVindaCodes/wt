import { Input } from "@windmill/react-ui";
import ParentCategory from "components/category/ParentCategory";
import DrawerButton from "components/form/DrawerButton";
import Error from "components/form/Error";
import InputArea from "components/form/InputArea";
import LabelArea from "components/form/LabelArea";
import SwitchToggle from "components/form/SwitchToggle";
import TextAreaCom from "components/form/TextAreaCom";
import Title from "components/form/Title";
import Uploader from "components/image-uploader/Uploader";
import useCategorySubmit from "hooks/useCategorySubmit";
import useProductSubmit from "hooks/useProductSubmit";
import Tree from "rc-tree";
import React from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useTranslation } from "react-i18next";
//internal import
import CategoryServices from "services/CategoryServices";
import { notifyError, notifySuccess } from "utils/toast";
import { showingTranslateValue } from "utils/translate";

const CategoryDrawer = ({ id, data, lang }) => {
  const { t } = useTranslation();
  // console.log("ids: ", id)
  const {
    checked,
    register,
    onSubmit,
    handleSubmit,
    errors,
    imageUrl,
    setImageUrl,
    published,
    setPublished,
    setChecked,
    selectCategoryName,
    setSelectCategoryName,
    handleSelectLanguage,
    isSubmitting,
    setChildren,
  } = useCategorySubmit(id, data);

  const {
    language,
    selectedCategory,
    setSelectedCategory,
    setDefaultCategory,
  } = useProductSubmit(id, data);

  // console.log("image=======>", imageUrl);

  const STYLE = `
  .rc-tree-child-tree {
    display: hidden;
  }
  .node-motion {
    transition: all .3s;
    overflow-y: hidden;
  }
`;

  const motion = {
    motionName: "node-motion",
    motionAppear: false,
    onAppearStart: (node) => {
      return { height: 0 };
    },
    onAppearActive: (node) => ({ height: node.scrollHeight }),
    onLeaveStart: (node) => ({ height: node.offsetHeight }),
    onLeaveActive: () => ({ height: 0 }),
  };


  // Logic Before
  // const renderCategories = (categories) => {
  //   let myCategories = [];
  //   for (let category of categories) {
  //     myCategories.push({
  //       title: showingTranslateValue(category.parent, lang),
  //       key: category._id,
  //       children:
  //         category.children?.length > 0 && renderCategories(category.children), // Fix
  //     });
  //   }

  //   return myCategories;
  // };



  // Modifications by: Govinda 3 / 4 / 20024

  // const renderCategories = (categories) => {
  //   let myCategories = [];
  //   if (categories !== undefined) {
  //     for (let category of categories) {
  //       // console.log("categories from Categories Drawer :", category)
  //       let children = [];
  //       if (category.children && category.children.length > 0) {
  //         children = category.children.map(child => ({
  //           title: showingTranslateValue(child, lang),
  //           key: child,
  //         }));
  //       }
  //       myCategories.push({
  //         title: showingTranslateValue(category?.parent, lang),
  //         key: category._id,
  //         children: children,
  //       });
  //     }
  //   }

  //   return myCategories;
  // };

  const renderCategories = (categories) => {
    let myCategories = [];
    if (categories !== undefined) {
      for (let category of categories) {
        // console.log("categories from Categories Drawer :", category.children)
        let children = [];
        if (category.children && category.children.length > 0) {
          children = category.children.map(child => ({
            title: showingTranslateValue(child, lang),
            key: child,
          }));
        }
        myCategories.push({
          title: showingTranslateValue(category?.parent, lang),
          key: category._id,
          children: children,
        });
      }
    }

    return myCategories;
  };


  // 3rd april tasks
  // const renderCategories = (categories) => {
  //   let myCategories = [];
  //   for (let category of categories) {
  //     const translatedName = category.parent;
  //     const translatedName1 = category.children;
  //     console.log('Translated name:', translatedName1);
  //     const children = category.children?.length > 0 ? renderCategories(category.children) : null;
  //     console.log('Children:', children);
  //     myCategories.push({
  //       title: translatedName,
  //       key: category._id,
  //       children: children,
  //     });
  //   }
  //   console.log('Processed categories:', myCategories);
  //   return myCategories;
  // };

  //   const findObject = (obj, target) => {
  //     console.log("targets", target);
  //     return obj?.children?.find(child => child._id === target._id);
  //       ?target
  // : target?.children?.reduce(
  //   (acc, obj) => acc ?? findObject(obj, target),
  //   undefined
  // );
  //   };

  const findObject = (obj, target) => {
    console.log("targets", target);
    return obj?.children?.find(child => child._id === target._id)
      ? target
      : target?.children?.reduce(
        (acc, child) => acc ?? findObject(child, target),
        undefined
      );
  };

  // const handleSelect = async (key) => {
  //   console.log('key', key);
  //   if (key === undefined) return;
  //   if (id) {
  //     const parentCategoryId = await CategoryServices.getCategoryById(key);

  //     if (id === key) {
  //       return notifyError("This can't be select as a parent category!");
  //     } else if (id === parentCategoryId.parentId) {
  //       return notifyError("This can't be select as a parent category!");
  //     } else {
  //       if (key === undefined) return;
  //       setChecked(key);

  //       const obj = data[0];
  //       const result = findObject(obj, key);

  //       setSelectCategoryName(showingTranslateValue(result?.name, lang));
  //     }
  //   } else {
  //     if (key === undefined) return;
  //     setChecked(key);

  //     const obj = data[0];
  //     const result = findObject(obj, key);
  //     console.log("hi:", result)
  //     setSelectCategoryName(showingTranslateValue(result, lang));
  //   }
  // };

  // const handleSelect = async (key) => {
  //   console.log('key', key);
  //   if (key === undefined) return;

  //   const obj = data[0];
  //   const result = findObject(obj, key);
  //   console.log("reuslts: ", result)
  //   if (!result) return; // Handle case when result is not found

  //   setChecked(key);

  //   if (result.parent) {
  //     // If result has a parent, set the parent category name
  //     setSelectCategoryName(showingTranslateValue(result, lang));
  //   } else {
  //     // If result doesn't have a parent, set its own name
  //     setSelectCategoryName(showingTranslateValue(result, lang));
  //   }
  // };

  // const handleSelect = async (key) => {
  //   console.log('key', key);
  //   if (key === undefined) return;

  //   const obj = data[0];
  //   const result = findObject(obj, key);

  //   if (!result) return;
  //   setChecked(key);
  //   setSelectCategoryName(showingTranslateValue(result, lang));
  // };

  const handleSelect = async (key) => {
    // console.log('key', key, 'id', id);
    console.log('key', key);
    if (key === undefined) return;
    if (id) {
      const parentCategoryId = await CategoryServices.getCategoryById(key);
      if (id === key) {
        return notifyError("This can't be select as a parent category!");
      } else if (id === parentCategoryId.parentId) {
        return notifyError("This can't be select as a parent category!");
      } else {
        if (key === undefined) return;
        setChecked(key);
        const obj = data[0];
        const result = findObject(obj, key);
        console.log("results:", result)
        setSelectCategoryName(showingTranslateValue(result, lang));
        setChildren(showingTranslateValue(result, lang))
      }
    } else {
      if (key === undefined) return;
      setChecked(key);
      const obj = data[0];
      const result = findObject(obj, key);
      console.log("results:", result)
      setSelectCategoryName(showingTranslateValue(result, lang));
      setChildren(showingTranslateValue(result, lang))
    }
  };


  // const findObject = (obj, target) => {
  //   return obj._id === target
  //     ? obj
  //     : obj?.children?.reduce(
  //       (acc, obj) => acc ?? findObject(obj, target),
  //       undefined
  //     );
  // };
  // const findObject = (obj, target) => {
  //   console.log("findObject called with obj:", obj, "target:", target); // Adding log here
  //   return obj._id === target
  //     ? obj
  //     : obj?.children?.reduce(
  //       (acc, obj) => acc ?? findObject(obj, target),
  //       undefined
  //     );
  // };
  // const handleSelect = async (key) => {
  //   console.log("handleSelect called with key:", key);
  //   if (key === undefined) return;

  //   if (id) {
  //     const parentCategoryId = await CategoryServices.getCategoryById(key);
  //     console.log("parents Id : ", parentCategoryId)
  //     if (id === key || parentCategoryId === id) {
  //       return notifyError("This can't be select as a parent category!");
  //     } else {
  //       setChecked(key);
  //       const obj = data[0];
  //       const result = findObject(obj, key);
  //       console.log("results: ", result);
  //       setSelectCategoryName(showingTranslateValue(result?.name, lang));
  //     }
  //   } else {
  //     setChecked(key);
  //     const obj = data[0];
  //     const result = findObject(obj, key);
  //     setSelectCategoryName(showingTranslateValue(result?.name, lang));
  //   }
  // };

  // const handleSelect = async (key) => {
  //   console.log("handleSelect called with key:", key);
  //   if (key === undefined) return;
  //   if (id) {
  //     const parentCategoryId = await CategoryServices.getCategoryById(key);

  //     if (id === key) {
  //       console.log("id is equal to key:", key);
  //       return notifyError("This can't be select as a parent category!");
  //     } else if (id === parentCategoryId.parentId) {
  //       console.log("id is equal to parentCategoryId.parentId:", parentCategoryId.parentId); // Adding log here
  //       return notifyError("This can't be select as a parent category!");
  //     } else {
  //       if (key === undefined) return;
  //       setChecked(key);

  //       const obj = data[0];
  //       const result = findObject(obj, key);

  //       setSelectCategoryName(showingTranslateValue(result?.name, lang));
  //     }
  //   } else {
  //     if (key === undefined) return;
  //     setChecked(key);

  //     const obj = data[0];
  //     const result = findObject(obj, key);

  //     setSelectCategoryName(showingTranslateValue(result?.name, lang));
  //   }
  // };

  // const findObject = (obj, target) => {
  //   console.log("Checking object:", obj);
  //   console.log("Target:", target);

  //   if (obj._id === target) {
  //     console.log("Found target object:", obj);
  //     return obj;
  //   } else if (obj.children && obj.children.length > 0) {
  //     // If the object has children, recursively search through them
  //     for (const child of obj.children) {
  //       console.log("Checking child:", child);
  //       const result = findObject(child, target);
  //       if (result) {
  //         console.log("Found target in child:", result);
  //         return result;
  //       }
  //     }
  //   }
  //   console.log("Target not found in object:", obj);
  //   return undefined; // If not found, return undefined
  // };

  // const findObject = (obj, target) => {
  //   console.log("Checking object:", obj);
  //   console.log("Target:", target);
  //   if (obj._id === target) {
  //     console.log("Found target object:", obj);
  //     return obj;
  //   } else if (obj.children && obj.children.length > 0) {
  //     for (const child of obj.children) {
  //       console.log("Checking child:", child);
  //       const result = findObject(child, target);
  //       if (result) {
  //         console.log("Found target in child:", result);
  //         return result;
  //       }
  //     }
  //   }
  //   console.log("Target not found in object:", obj);
  //   return undefined;
  // };


  // const handleSelect = async (key) => {
  //   console.log('Selected category key:', key);
  //   if (!key) return;
  //   try {
  //     const parentCategory = findObject(data[0], key);
  //     if (!parentCategory) {
  //       console.log('Parent category not found.');
  //       setSelectCategoryName('');
  //       return;
  //     }
  //     setChecked(key);
  //     setSelectCategoryName(showingTranslateValue(parentCategory.parent, lang));
  //   } catch (error) {
  //     console.error('Error occurred while handling category select:', error);
  //   }
  // };

  // const handleSelect = async (keys) => {
  //   console.log('Selected category keys:', keys);

  //   if (!keys || keys.length === 0) return;

  //   try {
  //     const selectedCategories = keys.map(key => findObject(data[0], key)).filter(Boolean);
  //     setSelectCategoryName(selectedCategories)
  //     if (selectedCategories.length === 0) {
  //       console.log('No parent categories found.');
  //       setSelectCategoryName('');
  //       return;
  //     }

  //     const parentCategoryNames = selectedCategories.map(category => showingTranslateValue(category.parent, lang));
  //     setChecked(keys);
  //     setSelectCategoryName(parentCategoryNames.join(', ')); // Join names if multiple categories selected
  //   } catch (error) {
  //     console.error('Error occurred while handling category select:', error);
  //     // Handle error
  //   }
  // };
  // const handleSelect = async (key) => {
  //   console.log('key', key, 'id', id);
  //   if (key === undefined) return;
  //   if (id) {
  //     const parentCategoryId = await CategoryServices.getCategoryById(key);

  //     if (id === key) {
  //       return notifyError("This can't be select as a parent category!");
  //     } else if (id === parentCategoryId.parentId) {
  //       return notifyError("This can't be select as a parent category!");
  //     } else {
  //       if (key === undefined) return;
  //       setChecked(key);

  //       const obj = data[0];
  //       const result = findObject(obj, key);

  //       setSelectCategoryName(showingTranslateValue(result?.name, lang));
  //     }
  //   } else {
  //     if (key === undefined) return;
  //     setChecked(key);

  //     const obj = data[0];
  //     const result = findObject(obj, key);

  //     setSelectCategoryName(showingTranslateValue(result?.name, lang));
  //   }
  // };


  // const handleSelect = async (keys) => {
  //   console.log('Selected category keys:', keys);

  //   if (!keys || keys.length === 0) return;

  //   try {
  //     const selectedCategories = keys.map(key => findObject(data[0], key)).filter(Boolean);
  //     setSelectCategoryName(selectedCategories);

  //     if (selectedCategories.length === 0) {
  //       console.log('No parent categories found.');
  //       setChecked(keys);
  //       return;
  //     }

  //     const parentCategoryNames = selectedCategories.map(category => showingTranslateValue(category.parent, lang));
  //     setChecked(keys);
  //     // Join names if multiple categories selected
  //     setSelectCategoryName(parentCategoryNames);
  //   } catch (error) {
  //     console.error('Error occurred while handling category select:', error);
  //     // Handle error
  //   }
  // };


  // const handleSelect = async (key) => {
  //   console.log('key', key, 'data', data);
  //   if (key === undefined) return;
  //   if (id) {
  //     const parentCategoryId = await CategoryServices.getCategoryById(key);

  //     if (id === key) {
  //       return notifyError("This can't be select as a parent category!");
  //     } else if (id === parentCategoryId.parentId) {
  //       return notifyError("This can't be select as a parent category!");
  //     } else {
  //       if (key === undefined) return;
  //       setChecked(key);

  //       const obj = data[0];
  //       const result = findObject(obj, key);

  //       setSelectCategoryName(showingTranslateValue(result?.parent, lang));
  //     }
  //   } else {
  //     if (key === undefined) return;
  //     setChecked(key);

  //     const obj = data[0];
  //     const result = findObject(obj, key);

  //     setSelectCategoryName(showingTranslateValue(result?.parent, lang));
  //   }
  // };

  // const handleSelect = async (key) => {
  //   try {
  //     // If key is undefined, return early
  //     if (key === undefined) return;

  //     // If id is defined, perform additional checks
  //     if (id) {
  //       // Retrieve the parent category ID asynchronously
  //       const parentCategoryId = await CategoryServices.getCategoryById(key);

  //       // Check if key matches the id or parentId of the current category
  //       if (id === key || id === parentCategoryId.parentId) {
  //         return notifyError("This can't be selected as a parent category!");
  //       }
  //       // Check if the parentCategoryId's parentId matches the id of the current category
  //       else if (parentCategoryId.parentId === id) {
  //         return notifyError("This category is already a parent category!");
  //       }
  //       else {
  //         // Set the key as checked
  //         setChecked(key);

  //         // Find the object in data array with the specified key
  //         const obj = data.find(item => item.id === key);
  //         if (obj) {
  //           // Set the category name based on translation
  //           setSelectCategoryName(showingTranslateValue(obj.parent, lang));
  //         } else {
  //           console.error(`Category object with id ${key} not found in data array.`);
  //         }
  //       }
  //     }
  //     else {
  //       // If id is not defined, simply set the key as checked
  //       setChecked(key);

  //       // Find the object in data array with the specified key
  //       const obj = data.find(item => item.id === key);
  //       if (obj) {
  //         // Set the category name based on translation
  //         setSelectCategoryName(showingTranslateValue(obj.parent, lang));
  //       } else {
  //         console.error(`Category object with id ${key} not found in data array.`);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //     // Optionally handle the error here
  //   }
  // };



  //  for using productdrawer selectCategories

  // const handleSelect = (key) => {
  //   const category = data.find((category) => category._id === key);

  //   // Check if the category is already selected
  //   const isSelected = selectedCategory.some((category) => category._id === key);

  //   if (isSelected) {
  //     // If the category is already selected, remove it
  //     setSelectedCategory((prev) => prev.filter((category) => category._id !== key));
  //   } else {
  //     // If the category is not selected, add it
  //     setSelectedCategory((prev) => [...prev, { _id: category._id, name: showingTranslateValue(category?.parent, lang) }]);

  //     // If the category has children, prompt the user to select them
  //     if (category.children && category.children.length > 0) {
  //       const shouldSelectChildren = notifySuccess("Do you want to select all children categories?");
  //       if (shouldSelectChildren) {
  //         const childrenToAdd = category.children.map((child) => ({
  //           _id: child._id,
  //           name: showingTranslateValue(child, lang)
  //         }));
  //         setSelectedCategory((prev) => [...prev, ...childrenToAdd]);
  //       }
  //     }
  //   }
  // };

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("UpdateCategory")}
            description={t("UpdateCategoryDescription")}
          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("AddCategoryTitle")}
            description={t("AddCategoryDescription")}
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("Name")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Category title"
                  name="name"
                  type="text"
                  placeholder={t("ParentCategoryPlaceholder")}
                />
                <Error errorName={errors.name} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("Description")} />
              <div className="col-span-8 sm:col-span-4">
                <TextAreaCom
                  required
                  register={register}
                  label="Description"
                  name="description"
                  type="text"
                  placeholder="Category Description"
                />
                <Error errorName={errors.description} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("ParentCategory")} />
              <div className="col-span-8 sm:col-span-4 relative">
                <Input
                  readOnly
                  {...register(`parent`, {
                    required: false,
                  })}
                  name="parent"
                  value={selectCategoryName ? selectCategoryName : ''}
                  placeholder={t("ParentCategory")}
                  type="text"
                  className="border h-12 w-full text-sm focus:outline-none block bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                />

                <div className="draggable-demo capitalize">
                  <style dangerouslySetInnerHTML={{ __html: STYLE }} />
                  <Tree
                    expandAction="click"
                    treeData={renderCategories(data)}
                    selectedKeys={[checked]}
                    // onSelect={(keys) => handleSelect(keys)}
                    onSelect={(v) => handleSelect(v[0])}
                    motion={motion}
                    animation="slide-up"
                  />
                </div>
              </div>
            </div>


            {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("Category")} />
              <div className="col-span-8 sm:col-span-4">
                <ParentCategory
                  lang={language}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  setDefaultCategory={setDefaultCategory}
                />
              </div>
            </div> */}

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("CategoryIcon")} />
              <div className="col-span-8 sm:col-span-4">
                <Uploader
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  folder="category"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("Published")} />
              <div className="col-span-8 sm:col-span-4">
                <SwitchToggle
                  handleProcess={setPublished}
                  processOption={published}
                />
              </div>
            </div>
          </div>

          <DrawerButton id={id} title="Category" isSubmitting={isSubmitting} />
        </form>
      </Scrollbars>
    </>
  );
};

export default CategoryDrawer;
