import { PATH } from '../../utils/const';
import { logo } from '../../assets';
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <Link to={PATH.HOME} className="flex justify-start tablet:hidden laptop:w-2/12">
            <img className="w-[120px] " src={logo} />
        </Link>
    );
};

export default Logo;
