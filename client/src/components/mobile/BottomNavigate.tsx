import { BOTTOM_NAVIGATE_MOBILE } from '../../utils/const';
import { NavLink } from 'react-router-dom';

export const BottomNavigate = () => {
    return (
        <div className="fixed w-full bottom-0 right-0 grid grid-cols-4 z-[1000] bg-white shadow-search laptop:hidden">
            {BOTTOM_NAVIGATE_MOBILE.map((e) => {
                return (
                    <NavLink to={e.link} className={(nav) => (nav.isActive ? 'bg-[rgb(229,231,235)]' : '') + ' py-2 flex flex-col items-center justify-center'}>
                        <img src={e.logo} className="w-[30%] h-auto" />
                        <p className="text-sm">{e.label}</p>
                    </NavLink>
                );
            })}
        </div>
    );
};
