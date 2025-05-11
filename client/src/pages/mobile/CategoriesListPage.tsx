import React from 'react';
import { Link } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useCategoriesStore } from '../../store/categoryStore';
import { PATH } from '../../utils/const';
import CategoryItem from '../../components/item/CategoryItem';

const CategoriesListPage: React.FC = () => {
    const { categories } = useCategoriesStore();
    return (
        <div className="fixed-mobile bg-white z-[1000] ">
            <Link to={`${PATH.HOME}`} className=" absolute top-2 left-4 text-secondary laptop:hidden ">
                <ChevronLeftIcon fontSize="large" />
            </Link>
            <h3 className="text-xl text-center my-3">Danh mục sản phẩm</h3>

            <div className="grid tablet:grid-cols-2 gap-3">
                {categories.map((e) => (
                    <CategoryItem props={e} />
                ))}
            </div>
        </div>
    );
};

export default CategoriesListPage;
