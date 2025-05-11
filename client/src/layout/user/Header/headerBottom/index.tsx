import Cart from '../../../../components/cart';
import Logo from '../../../../components/logo';
import { useActionStore } from '../../../../store/actionStore';
import Search from './Search';
// import Cart from '../../cart';

const HeaderBottom = () => {
    const { mobile_ui } = useActionStore();
    return (
        <div className="flex w-full h-full items-start tablet:py-[5px] py-[10px] px-4 mb-3 ">
            <Logo />
            <Search />
            {!mobile_ui && <Cart />}
        </div>
    );
};

export default HeaderBottom;
